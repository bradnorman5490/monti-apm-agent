import { WebApp } from 'meteor/webapp';
import { checkHandlersInFiber } from "../../lib/hijack/wrap_webapp";

const releaseParts = Meteor.release.split('METEOR@')[1].split('.').map(num => {
  return parseInt(num, 10)
})

// Check if Meteor 1.6.1 or newer, which are the
// versions that wrap connect handlers in a fiber
const httpMonitoringEnabled = releaseParts[0] > 0 &&
  (releaseParts[1] === 6 ? releaseParts[2] > 0 : releaseParts[1] > 6)

Tinytest.add(
  'Webapp - checkHandlersInFiber',
  function (test) {
    const expected = httpMonitoringEnabled
    test.equal(checkHandlersInFiber(), expected);
  }
);

if (httpMonitoringEnabled) {
  Tinytest.add(
    'Webapp - return connect app from .use',
    function (test) {
      const result = WebApp.connectHandlers.use((req, res, next) =>{
        next();
      });

      test.equal(result, WebApp.connectHandlers);
    }
  )
}
