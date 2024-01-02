# Using AWS in NextJS API Handlers

## Setting Up

You will need to have:

1. An AWS Account.
2. A role for the webpage.
3. Trust Policies for the webpage.

### Configuring the CLI

1. Run the following command:

    ```sh
    aws configure sso
    ```

2. Use the basic values, and DO NOT set a **_session name_**.
3. Set the region as 'ap-southeast-1', and the 'cli-output' to 'json'.
4. Set the profile name as 'dev-profile'.
5. Run the following command:

    ```sh
    aws sso login --profile dev-profile
    ```

6. You may start the application.

### Application Code

In the code, you may wish to instantiate one of the many AWS SDK packages.

To authenticate the Lambda Client, for instance, you may set it up like so:

```ts
import { LambdaClient } from '@aws-sdk/client-lambda';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';

const getLambdaClient = () => {
  const client = new LambdaClient({
    region: 'ap-southeast-1',
    credentials: fromTemporaryCredentials({
      params: {
        RoleArn: 'role-arn',
        RoleSessionName: 'webApplication-NextJS',
        DurationSeconds: 1800
      }
    })
  });
  return client;
};
```

Then, you may use this code on the server, as required.

### AWS Account Permissions

You may either grant the required trust policies to the webpage role directly, or assign
them to other entities that the webpage is allowed to act on, through an Assume Role policy.

Here's how it would work with ECS:

```txt
| ECS (Webpage) |  ----------> | Trust Role | ---------> | Other Assets |                    
  ^                assume-role        ^                      ^
  Webpage Role                  Intermediary Role       Individual Asset Roles    
```

That way, the webpage only has the permissions it needs, and there is a separation
of concerns between the various entities.

For instance, the asset may be a Lambda which only has the permissions to interact
with a database. This is better than assigning those permissions directly to the
webpage role itself, as we can be sure that access to those actions are only via
that lambda.

Then, the webpage can implement its own logic to control the access to the invocation
of the resources on the webpage's behalf, while knowing that its own entity role
(the webpage role) does not have the base permissions to perform those actions,
and can only interact with tha Asset through user defined code.

This goes a long way towards eliminating privilege escalation on the webpage instance
itself.
