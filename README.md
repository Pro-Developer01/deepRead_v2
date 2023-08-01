# DeepRead - React App

1. Install all dependencies: npm install
2. Run the application: npm start (will launch on Port 3000 by React default)
3. ENV variables, need to be created, check the example.env, copy, rename to .env and then fill out the needed variables depending on your environments.
   1. There are 3 environments: DEV, STAGING, PROD
   2. DEV: is to be used for local deployments
   3. STAGING: used to deply on our virtual server (app.deepread.com)
   4. PROD: used to launch on our k8s cluster (frontend.deepread.com, might need a better naming convention)
4. Key differences:
   1. DEV: should run local, has additional debbugings, can hot reload, reactotron, etc.
   2. STAGING: should only if needed include hot reload (quick fixes are faster visible like this)
   3. PROD: none, the most optimal setup, no errors if possible, *no console logs at all (!!!NO TOKENS!!!, NO ID'S!!!)*
