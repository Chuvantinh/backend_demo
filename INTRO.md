# Prisma

#### What is Prisma?
 * GraphQL based
 * Database agnostic ORM System
 * Typescript CRUD API generator

### What does it do?

Takes input written in GraphQL SDL and turns it into a Database (schema) and Typescript API.

See: `database/datamodel.graphql` file. 
The datamodel defined in this file gets turned into 
1. A Database - hosted in Docker
2. A Typesafe CRUD API - in Typescript

These two things are generated when running the `prisma deploy` command.
  * this is defined in the `./prisma.yml` file

#### Prisma Client

The Typescript API generated with "prisma-client" and the output is found in the `app/src/generated/prisma-client`.

> See: https://www.prisma.io/blog/prisma-client-preview-ahph4o1umail for an introduction to Prisma Client.
> 
> Docs are here: https://www.prisma.io/docs/prisma-client/

### Server

As the Prisma Client exposes **all** of the Database for read, write and delete access an additional wrapper is needed.

This wrapper is Server which can be found in the `./app/` Folder. Apollo Server is used as Framework here.
> Apollo Server Docs: https://www.apollographql.com/docs/apollo-server/

The Server also implements GraphQL resolver for non scalar datatypes. See `./app/src/resolver/nested` Folder.

The Server exposes a Public GraphQL API Schema which is defined in `./app/src/schema/schema.graphql`.

This Schema is accessible from the Client - the Angular Frontend (after a known user has Authenticated).

Each of the Public facing GraphQL Query and Mutations need to be resolved in the Server.

These resolvers are defined in `./app/src/resolver/`. These resolvers extend the Prisma generated types.

In these resolvers the Databse is accessed via the generated Typescript CRUD API.

## Creating new Types
The following steps are needed to create an new Database Table with columns and API and Public Schema.

Make sure the Docker Container are running (prisma api and database)! Check with `docker ps` command

Let the Server run in Watch mode: `npm run node-dev` !

1. Define new DB type in `./database/datamodel.graphql` in GraphQL SDL language
   *  See Docs here: https://www.prisma.io/docs/datamodel-and-migrations/datamodel-POSTGRES-knum/ for reference
2. Run the `prisma deploy` command
   * Attention: Always use the  appropriate env File! Full command with env is: `prisma deploy --env-file .env.docker`
   * The Database and Files in `./app/src/generated` should be updated now
   * The newly Created DB Types should now be accessible via the GraphQL Playground (default at: http://localhost:4477). Prisma has generated GraphQL Types to Create, Read, Update and Delete the new DB Table.
   * These types are now also available via the generated Typescript API in the resolvers (via the Context `ctx.db.` )
3. Create a Public schema for the new Types
   * This is needed to make the new Types accessible from the Public API (i.e. via the Angular Frontend)
   * Create the appropriate Querys and Mutations in the `./app/src/schema/schema.graphql` File
   * Run `prisma deploy` command again - the compiler should now complain that resolvers are missing.
   * Implement the resolvers in one of the domain specific resolver files found in `./app/src/resolver`. Or Create an new resolver file if needed - if a new file is used add it to the`index.ts` in `./app/src/resolver/index.ts`.
   * Don't forget to Pick the types from the default resolver definitions. 
 ```
 export const UserQueryResolver: Pick<
    QueryResolvers.Type
    , 'getUser'
    | 'getUserById'
    > = {
      ...QueryResolvers.defaultResolvers,
    }
```
The type should now be Accessible via the Public API. Check this via the Playground at http://localhost:4011

### Client Side

This refers to the Angular Frontend found in https://gitlab.com/aid-project/BuddyApp .

The client side types are also auto generated via the GraphQL Code Generator for the Apollo GraphQL Client library.

> GraphQL Code Generator: https://graphql-code-generator.com/docs/getting-started/ 
>
> Apollo Client: https://www.apollographql.com/docs/angular/

Scripts for the type generations are setup in the `package.json` file and are available via `npm run gql-gen`.

This command introspects the Public server API and validates it against the client side defined queries and mutations.

Client queries are defined in `./src/app/graphql/queries/`.

1. Create a query or mutation for the newly created type in one of the `query.graphql` files.
  * install this helpful vscode plugin the get autocomplete and validation of the graphql types:
     * Apollo GraphQL https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo
     * Run it in vscode via `F1` -> ``Apollo: Reload Schema`
2. run  `npm run gql-gen` to generate the Typescript Apollo Client and to access the Queries and Mutations in your Angular Components / Services
    * Generated Types are found in `./src/app/graphql/generated/graphql.ts`


Thats it! End to End typesafe Database access via GraphQL.

![image](https://gitlab.com/aid-project/buddybackend/-/wikis/uploads/7a99be5e8894fffa24c651d300b56e54/image__1_.png)
