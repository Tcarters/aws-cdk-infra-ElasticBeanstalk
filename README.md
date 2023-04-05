# Using AWS CDK infra to deploy a Node Application to AWS Elastic BeanStalk

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

![image](https://user-images.githubusercontent.com/71230412/229961930-c1458f1f-b3c8-453b-95a7-dde4710658eb.png)

- Also we have an empty S3 bucket

![image](https://user-images.githubusercontent.com/71230412/229961804-b4eb6687-61d6-4934-89b8-797307ca5297.png)


- Same for AWS Elastic Beanstalk

![image](https://user-images.githubusercontent.com/71230412/229961730-ab9cee0e-e323-4d01-a29d-62c1a9f2446c.png)



###  Exceuting commands for deployment
- Bootstraping our AWS Account for correct configuration
```bash
    cdk bootstrap
```
- Checking the Differences changes
```bash
    cdk diff
```
- Deployment
```bash
    cdk deploy
```
