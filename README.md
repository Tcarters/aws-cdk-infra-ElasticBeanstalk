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

## Process to build goes like this:

## Install dependencies
```bash
    sudo npm install -g aws-cdk  ## Install aws cdk tool if not installed earlier
    cdk --version
```
## Initialize our app

```bash
    mkdir  aws-cdk-infra-ElasticBeanstalk && cd aws-cdk-infra-ElasticBeanstalk 
    cdk init app --language typescript    
```

## Writing the Infrastructure Code 
- All our code will be defined in the file `aws-cdk-infra-ElasticBeanstalk/lib/aws-cdk-infra-elastic_beanstalk-stack.ts` . 

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
    aws sts get-caller-identity
    aws configure get region
    aws cloudformation delete-stack --stack-name CDKToolkit ## to erase old stack if present
    cdk bootstrap aws://ACCOUNT-NUMBER-1/REGION-1 --force # to clean previous configuration
```
- Checking the Differences changes
```bash
    cdk diff
```
- Output of the CD:
 
 ![image](https://user-images.githubusercontent.com/71230412/229962794-6eebc36b-612b-44d1-8e2a-1ca146215ae6.png)


- After we have packaged our Node.js application, and bootstrapped our AWS account and Region, we are ready to build and deploy the CDK application.
- The first step is to build the CDK application.
```bash
    npm run build
```
- If there are no errors in our application, this will succeed. We can now deploy the CDK application in the cloud.

```bash
    cdk deploy
```
![cdkDEPLOY-elb](https://user-images.githubusercontent.com/71230412/230296781-8eb84400-2f7f-4b95-ab82-3057753aa3f3.png)

- Cleaning our environment by desstroying everything and removing

```bash
    cdk destroy
```      
![cdkDESTROY](https://user-images.githubusercontent.com/71230412/230296855-4ce284fd-3435-4885-8dfc-efa1160688d1.png)
