# Simple Cloud Storage

Simple cloud storage is an aws [amplify](https://aws.amazon.com/amplify/) based [vue](https://vuejs.org/) web app, for hosting files.
It uses only the Storage and Authentication modules of amplify backend. This provides basic username/password authentication and file storage and sharing functionality.

This repo contains both frontend and backend code. Front end is Vue.js webapp while backend is AWS Amplify. Front end and backend can be easily built from the code. Following are the requirements for performing the build.

1. AWS Account
2. Amplify CLI [Amplify Docs ](https://docs.amplify.aws/cli/) 
3. Git [Download Git](https://git-scm.com/)
3. Node.js and npm [Nodejs](https://nodejs.org/en/)

## 1. Cloning the Repository
Make a local copy of the repository using git. Run the following command in the terminal
```
git clone https://github.com/3diab/simplecloudstorage.git
```
If you have forked this repo, use the link of that repository insted.

## 2. Initialize the project

Initialize the project and install all its dependencies by using following command

``` 
npm install
```

## 3. Provision Backend

To provision backend we are using the Amplify CLI . Run the follwing command to initialize amplify

```
amplify init
```
Next, use amplify push command to provision the resource and build the backend

```
amplify push
```

This command also generates necessary configuration files in the project as well. The configuration settings are contained in ``src/aws-exports.js``. Since our project is in javascript , rename the file as ``aws-exports.ts``.

## 4. Building and deploying the frontend app

You can serve the app locally using ``npm run serve`` or build the distribution files by running ``npm run build``, this will create the build of the app in the ``dist`` directory. 

Run `` amplify publish `` to build and deploy the app on amplify hosting. It will also give the hosted url as the command output. Visit the link to access the web app.


Alternatively you can also self host the build files (contents of the dist folder) on your own server as well. You can host the same app at multiple servers , but will be using same backend.

## 5. Adding users to manage app backend

Amplify allows to manage the backend through a web console. To access it use the follwing command:
```
amplify console
```
This will present with two options:
```
> Amplify Studio
> AWS Console
```
For adding users to manage the backend, select ``AWS Console`` . This will open aws console for managing amplify settings.
Sign in  to the console and select Amplify studio settings.

<img width="1317" alt="Screenshot 2022-04-03 at 11 10 55 PM" src="https://user-images.githubusercontent.com/70580184/161483064-a5125ac0-b197-495b-94e8-7aebd24e3fa4.png">

Press 'Invite Users' button to add new users.

<img width="605" alt="Screenshot 2022-04-03 at 11 11 28 PM" src="https://user-images.githubusercontent.com/70580184/161483132-416f7773-4567-4759-94e3-eae016d810ad.png">

You can also define the access level of the user, in this dialog.

After the user is added rerun the ``amplify console`` command and choose ``Amplify Console``. Sign into amplify console.

<img width="546" alt="Screenshot 2022-04-04 at 11 36 42 AM" src="https://user-images.githubusercontent.com/70580184/161484018-9f2f5d3f-b831-424e-865a-eb8e3c3032f5.png">

## 6. Configuring user storage quotas

By default each user has 1 GB of storage available. The storage quota is allocated by adding user to special user groups.
In order to create and add users to quotas, first we need to create user groups in the amplify console. Log into amplify console and select ``User Management``. Select `` Groups`` tab and Create group.

<img width="1111" alt="Screenshot 2022-04-05 at 12 25 45 PM" src="https://user-images.githubusercontent.com/70580184/161696942-767ea592-115b-4a37-93fe-04638a5896ca.png">

### Quota Group nameing.
Quota group name has to follow this format:

``` 
__storage__[storage size in bytes]
For example:
1 GB Quota - __storage__1024*1024*1024
5 GB Quota - __storage__1024*1024*1024*5
1 TB Quota - __storage__1024*1024*1024*1024
```
For alloting quota to a user, add the user to specific quota group. For this select the ``Users`` tab in user management and add user to group.

```diff
- This is an open file sharing platform, anyone with the files public url can download the file. 
- Do not use this to host confidential files
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
