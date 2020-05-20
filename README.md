# CDK Skills - Express ECS Stack

What is this?
This is an example using the AWS CDK to create an ECS service, with an Application Load Balancer, build a local docker image, push it to AWS ECR and deploy it on an ECS Stack

Within the `/src` directory, is a demo express server and its Dockerfile.
The CDK stack, will locate it and build the image automatically.

## To Deploy

1. Make sure your AWS profile/credentials are set
   `export AWS_PROFILE=<profile name>`

2. Install dependencies
   `npm i`

3. Deploy
   `npx cdk deploy`

## Useful commands

- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk destroy` remove this stack from your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
