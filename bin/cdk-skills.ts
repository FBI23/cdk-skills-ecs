#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import { EcsExpressStack } from "../lib/cdk-skills-stack";

const app = new cdk.App();

new EcsExpressStack(app, "ExpressTestStack");

app.synth();
