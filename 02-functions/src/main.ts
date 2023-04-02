import { App } from "cdktf";
import { HelloFunctionStack } from "./stacks/hello-function-stack";

const project = 'cdktf-example';
const environment = 'dev';
const app = new App();
new HelloFunctionStack(app, "hello_function", {
  backend: {
    bucket: process.env.TERRAFORM_BACKEND_BUCKET,
    prefix: `02-functions/${environment}`,
  },
  provider: {
    project: process.env.GOOGLE_CLOUD_PROJECT,
    region: process.env.GOOGLE_CLOUD_REGION,
  },
  domain: process.env.TERRAFORM_DOMAIN,
  environment,
  project: project,
  region: process.env.GOOGLE_CLOUD_REGION,
});
app.synth();
