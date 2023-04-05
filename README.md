# Using AWS CDK infra with TypeScript as base language to deploy a Node Application to AWS Elastic BeanStalk

In this small project we learn how to write AWS CDK infra code using the version 2.72.1 to deploy a Node.js Application to Aws Elastic Beanstalk with TypeScript.


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* The `cdk.json` file tells the CDK Toolkit how to execute your app.


## Checking Stack and Resources on AWS before deployment
- We can see below that our ELb stak is not yet deployed.


- Also we have an empty S3 bucket

- Same for AWS Elastic Beanstalk



## 
- Bootstraping our AWS Account for correct configuration
```bash
    cdk bootstrap
```
- Checking the Differences changes
```bash
    cdk diff
```