#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack.mjs';
import { PingDBStack } from '../lib/r2r-stack.mjs';
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

const app = new cdk.App();

const r2rStack = new PingDBStack(app, 'PingDBMain', {
    env: {
        account: '731803237567',
        region: 'us-west-2',   
    },
});

const ec2Client = new EC2Client({ region: 'us-west-2' });

async function getRegions() {
    const command = new DescribeRegionsCommand({});
    const response = await ec2Client.send(command);
    return response.Regions.map(region => region.RegionName);
}

async function deploy() {
    const regions = await getRegions();

    regions.forEach((region) => {
        const id = `LambdaStack-${region}`;
        new LambdaStack(app, id, {
            table: r2rStack.getTableReference(),
            env: {
                account: '731803237567', 
                region: region,
            },
        });
    });

    app.synth();
}

deploy().catch(err => {
    console.error('Error deploying CDK app:', err);
    process.exit(1);
});
