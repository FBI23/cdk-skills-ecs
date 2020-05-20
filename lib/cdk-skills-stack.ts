import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import path = require("path");
import { Vpc } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancedEc2Service } from "@aws-cdk/aws-ecs-patterns";
import { App, CfnOutput, Stack, StackProps } from "@aws-cdk/core";

export class EcsExpressStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "ecs-test-express",
    });

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new Vpc(this, `${id}-vpc`, {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Ingress",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "DB",
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    });
    const cluster = new ecs.Cluster(this, `${id}-cluster`, { vpc });

    // Specify capacity and auto scaling rules for the cluster
    cluster.addCapacity("new-scaling-group", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3A,
        ec2.InstanceSize.MICRO
      ),
      desiredCapacity: 1,
      maxCapacity: 1,
      associatePublicIpAddress: true,
      // specify an ssh key name, that should be added to each
      // ec2 instance that's created
      // keyName: "st-eng-yatin-key",
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // add inbound rule to allow ssh conenctions
    cluster.connections.allowFromAnyIpv4(ec2.Port.tcp(22), "allow connections");

    const taskDefinition = new ecs.Ec2TaskDefinition(
      this,
      `${id}-task-definition`
    );
    // add a container to the ECS service and task
    const expressContainer = taskDefinition.addContainer(
      `${id}-container-express`,
      {
        image: ecs.ContainerImage.fromAsset(
          path.resolve(__dirname, "..", "src")
        ),
        memoryLimitMiB: 600,
        environment: {
          key: "value",
        },
        logging,
        command: ["/bin/sh", "-c", "node /src/server.js"],
      }
    );

    expressContainer.addPortMappings({
      containerPort: 3000,
      hostPort: 3000,
    });

    const loadBalancedService = new ApplicationLoadBalancedEc2Service(
      this,
      `${id}-alb-service-one`,
      {
        cluster,
        memoryLimitMiB: 1000,
        cpu: 512,
        desiredCount: 1,
        serviceName: `${id}-alb-service-one`,
        // Note the taskdefiniton, defined above
        taskDefinition,
        publicLoadBalancer: true,
        minHealthyPercent: 100,
      }
    );

    loadBalancedService.targetGroup.configureHealthCheck({
      healthyHttpCodes: "200-402",
    });

    // Output the loadbalancer endpoint
    new CfnOutput(this, "ALBEndpoint", {
      value: loadBalancedService.loadBalancer.loadBalancerDnsName,
    });
  }
}
