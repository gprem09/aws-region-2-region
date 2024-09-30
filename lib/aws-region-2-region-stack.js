const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');

class AwsRegion2RegionStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRegion2RegionQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { AwsRegion2RegionStack }
