
# HAFFA LAMBDAS

# Description
Each function is built like an independent function. But are deployed using Amplify by the main package.json in root folder. 

To be able to compile typescript each function needs a build script in local package.json referenced from main package.json with script name amplify:{functionname}

# Layers
It is possible to add a shared layer with common npm packages using amplify. Note that it is only the npm packages installed in the layer that is able to reuse. 

# Current functions
## addUserToGroup
This is a workaround on create user function. This will check if the user is "new" and in that case make sure that the user is added to the correct group. This is not possible to do in a mergeUser type of lambda. This will be triggered each login!

## emailnotification
This lambda is triggered on each change in dynamodb. It goes through the past and new version and do actions depending on business logic. Usually e-mail users. 

## migrateADUser
This is triggered when a user tries to login with a username that doesn't exist in cognito. This lambda tries to get login details from Helsingborg AD. The return event from this lambda is used by amplify to create the user. 

## ScheduledNotifications
A lambda triggered on a recurring basis. Usually once per night. It searches the opensearch indexes and handles the matches using business logic. Usually send reminder emails


# Tests
To easily run tests on function add test scripts in main package.json using test:{functionname}
Tests are written in JEST and located in ./spec folder. 