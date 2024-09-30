import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

class PingDBStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        this.table = new dynamodb.Table(this, 'PingDB', {
            tableName: 'PingDB',
            partitionKey: { name: 'origin', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'destination#timestamp', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new cdk.CfnOutput(this, 'PingDBTableArn', {
            value: this.table.tableArn,
            description: 'ARN of the PingDB DynamoDB table',
            exportName: 'PingDBTableArn',
        });
    }

    getTableReference() {
        return this.table;
    }
}

export { PingDBStack };
