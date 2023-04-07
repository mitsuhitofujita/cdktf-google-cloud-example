declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                GOOGLE_CLOUD_PROJECT: string;
                GOOGLE_CLOUD_REGION: string;
                TERRAFORM_DOMAIN: string;
                TERRAFORM_BACKEND_BUCKET: string;
            }
        }
    }
}