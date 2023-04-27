import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Mgo+DSMBaFt/QHRqVVhkX1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSH9Vd0dgXX9beXNUTg==;Mgo+DSMBPh8sVXJ0S0J+XE9AdVRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31Td0RlWH1ddHRQT2hfWQ==;ORg4AjUWIQA/Gnt2VVhkQlFaclxJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiX35cc3BVQ2lVWUw=;OTQ5MTUwQDMyMzAyZTM0MmUzMGpmajNaTmtySEFDc2o4Y2sxZnlSSTNLR0lJajRKd05DNWQ3Ny9wMjZGMUU9;OTQ5MTUxQDMyMzAyZTM0MmUzMFpYWStPMlFQUFhmejFnZlpwdWJteFkrL1ZxWjNUNkZiVTAxRjloZXBiQnM9;NRAiBiAaIQQuGjN/V0Z+WE9EaFtBVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUViWHlfcndRRmZcV01+;OTQ5MTUzQDMyMzAyZTM0MmUzMFVzWjkxSWJVSGxwVDRDczZmUWJ4TWl5YlRWdzhsNGI5a0xCQWhmZ2xyOWc9;OTQ5MTU0QDMyMzAyZTM0MmUzMEJHQmxrLy8yWndDSXVua3hBRnJaSFNIcHVtY2FKTlRJdCtCd0hLVUZGTzQ9;Mgo+DSMBMAY9C3t2VVhkQlFaclxJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRiX35cc3BVQGFZWUw=;OTQ5MTU2QDMyMzAyZTM0MmUzMFVBSjVva0pDbS84bjQ3dEpnMzYvRVRtUFBxUmFsaUFFRGNWT09iRFdLbEU9;OTQ5MTU3QDMyMzAyZTM0MmUzMEVVVk9XOTl4YkkwVTQ1Qlo3b0drWEloQnl0eTlldVIrRGdSMGVSbkIwT1U9;OTQ5MTU4QDMyMzAyZTM0MmUzMFVzWjkxSWJVSGxwVDRDczZmUWJ4TWl5YlRWdzhsNGI5a0xCQWhmZ2xyOWc9');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
