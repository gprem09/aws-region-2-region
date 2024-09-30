import { Stack, Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

class LambdaStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const { table } = props;

        const r2r = new lambda.Function(this, 'regionFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'region-to-region.handler',
            code: lambda.Code.fromAsset('resources/lambdas/'),
            environment: {
                THIS_REGION: Stack.of(this).region,
                TABLE_NAME: table.tableName,
            },
        });

        r2r.addToRolePolicy(new PolicyStatement({
            actions: ['dynamodb:PutItem', 'ec2:DescribeRegions'],
            resources: [
                table.tableArn,
                '*',
            ],
        }));

        new Rule(this, `schedule-${Stack.of(this).region}`, {
            schedule: Schedule.rate(Duration.minutes(1)), 
            targets: [new LambdaFunction(r2r)],
        });
    }
}

export { LambdaStack };
