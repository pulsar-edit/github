"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildStatusFromCheckResult = buildStatusFromCheckResult;
exports.buildStatusFromStatusContext = buildStatusFromStatusContext;
exports.combineBuildStatuses = combineBuildStatuses;
// Commit or pull request build status, unified from those derived from the Checks API and the Status API.
const DEFAULT = {
  icon: 'unverified',
  classSuffix: 'pending'
};
const PENDING = {
  icon: 'primitive-dot',
  classSuffix: 'pending'
};
const SUCCESS = {
  icon: 'check',
  classSuffix: 'success'
};
const FAILURE = {
  icon: 'x',
  classSuffix: 'failure'
};
const ERROR = {
  icon: 'alert',
  classSuffix: 'failure'
};
const ACTION_REQUIRED = {
  icon: 'bell',
  classSuffix: 'failure'
};
const NEUTRAL = {
  icon: 'dash',
  classSuffix: 'neutral'
};
const STATUS_CONTEXT_MAP = {
  EXPECTED: PENDING,
  PENDING,
  SUCCESS,
  ERROR,
  FAILURE
};

function buildStatusFromStatusContext({
  state
}) {
  return STATUS_CONTEXT_MAP[state] || DEFAULT;
}

const PENDING_CHECK_STATUSES = new Set(['QUEUED', 'IN_PROGRESS', 'REQUESTED']);
const COMPLETED_CHECK_CONCLUSION_MAP = {
  SUCCESS,
  FAILURE,
  TIMED_OUT: ERROR,
  CANCELLED: ERROR,
  ACTION_REQUIRED,
  NEUTRAL
};

function buildStatusFromCheckResult({
  status,
  conclusion
}) {
  if (PENDING_CHECK_STATUSES.has(status)) {
    return PENDING;
  } else if (status === 'COMPLETED') {
    return COMPLETED_CHECK_CONCLUSION_MAP[conclusion] || DEFAULT;
  } else {
    return DEFAULT;
  }
}

const STATUS_PRIORITY = [DEFAULT, NEUTRAL, SUCCESS, PENDING, FAILURE, ERROR, ACTION_REQUIRED];

function combineBuildStatuses(...statuses) {
  let highestPriority = 0;
  let highestPriorityStatus = NEUTRAL;

  for (const status of statuses) {
    const priority = STATUS_PRIORITY.indexOf(status);

    if (priority > highestPriority) {
      highestPriority = priority;
      highestPriorityStatus = status;
    }
  }

  return highestPriorityStatus;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvYnVpbGQtc3RhdHVzLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFQiLCJpY29uIiwiY2xhc3NTdWZmaXgiLCJQRU5ESU5HIiwiU1VDQ0VTUyIsIkZBSUxVUkUiLCJFUlJPUiIsIkFDVElPTl9SRVFVSVJFRCIsIk5FVVRSQUwiLCJTVEFUVVNfQ09OVEVYVF9NQVAiLCJFWFBFQ1RFRCIsImJ1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHQiLCJzdGF0ZSIsIlBFTkRJTkdfQ0hFQ0tfU1RBVFVTRVMiLCJTZXQiLCJDT01QTEVURURfQ0hFQ0tfQ09OQ0xVU0lPTl9NQVAiLCJUSU1FRF9PVVQiLCJDQU5DRUxMRUQiLCJidWlsZFN0YXR1c0Zyb21DaGVja1Jlc3VsdCIsInN0YXR1cyIsImNvbmNsdXNpb24iLCJoYXMiLCJTVEFUVVNfUFJJT1JJVFkiLCJjb21iaW5lQnVpbGRTdGF0dXNlcyIsInN0YXR1c2VzIiwiaGlnaGVzdFByaW9yaXR5IiwiaGlnaGVzdFByaW9yaXR5U3RhdHVzIiwicHJpb3JpdHkiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBRUEsTUFBTUEsT0FBTyxHQUFHO0FBQ2RDLEVBQUFBLElBQUksRUFBRSxZQURRO0FBRWRDLEVBQUFBLFdBQVcsRUFBRTtBQUZDLENBQWhCO0FBS0EsTUFBTUMsT0FBTyxHQUFHO0FBQ2RGLEVBQUFBLElBQUksRUFBRSxlQURRO0FBRWRDLEVBQUFBLFdBQVcsRUFBRTtBQUZDLENBQWhCO0FBS0EsTUFBTUUsT0FBTyxHQUFHO0FBQ2RILEVBQUFBLElBQUksRUFBRSxPQURRO0FBRWRDLEVBQUFBLFdBQVcsRUFBRTtBQUZDLENBQWhCO0FBS0EsTUFBTUcsT0FBTyxHQUFHO0FBQ2RKLEVBQUFBLElBQUksRUFBRSxHQURRO0FBRWRDLEVBQUFBLFdBQVcsRUFBRTtBQUZDLENBQWhCO0FBS0EsTUFBTUksS0FBSyxHQUFHO0FBQ1pMLEVBQUFBLElBQUksRUFBRSxPQURNO0FBRVpDLEVBQUFBLFdBQVcsRUFBRTtBQUZELENBQWQ7QUFLQSxNQUFNSyxlQUFlLEdBQUc7QUFDdEJOLEVBQUFBLElBQUksRUFBRSxNQURnQjtBQUV0QkMsRUFBQUEsV0FBVyxFQUFFO0FBRlMsQ0FBeEI7QUFLQSxNQUFNTSxPQUFPLEdBQUc7QUFDZFAsRUFBQUEsSUFBSSxFQUFFLE1BRFE7QUFFZEMsRUFBQUEsV0FBVyxFQUFFO0FBRkMsQ0FBaEI7QUFLQSxNQUFNTyxrQkFBa0IsR0FBRztBQUN6QkMsRUFBQUEsUUFBUSxFQUFFUCxPQURlO0FBQ05BLEVBQUFBLE9BRE07QUFDR0MsRUFBQUEsT0FESDtBQUNZRSxFQUFBQSxLQURaO0FBQ21CRCxFQUFBQTtBQURuQixDQUEzQjs7QUFJTyxTQUFTTSw0QkFBVCxDQUFzQztBQUFDQyxFQUFBQTtBQUFELENBQXRDLEVBQStDO0FBQ3BELFNBQU9ILGtCQUFrQixDQUFDRyxLQUFELENBQWxCLElBQTZCWixPQUFwQztBQUNEOztBQUVELE1BQU1hLHNCQUFzQixHQUFHLElBQUlDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxhQUFYLEVBQTBCLFdBQTFCLENBQVIsQ0FBL0I7QUFFQSxNQUFNQyw4QkFBOEIsR0FBRztBQUNyQ1gsRUFBQUEsT0FEcUM7QUFDNUJDLEVBQUFBLE9BRDRCO0FBQ25CVyxFQUFBQSxTQUFTLEVBQUVWLEtBRFE7QUFDRFcsRUFBQUEsU0FBUyxFQUFFWCxLQURWO0FBQ2lCQyxFQUFBQSxlQURqQjtBQUNrQ0MsRUFBQUE7QUFEbEMsQ0FBdkM7O0FBSU8sU0FBU1UsMEJBQVQsQ0FBb0M7QUFBQ0MsRUFBQUEsTUFBRDtBQUFTQyxFQUFBQTtBQUFULENBQXBDLEVBQTBEO0FBQy9ELE1BQUlQLHNCQUFzQixDQUFDUSxHQUF2QixDQUEyQkYsTUFBM0IsQ0FBSixFQUF3QztBQUN0QyxXQUFPaEIsT0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJZ0IsTUFBTSxLQUFLLFdBQWYsRUFBNEI7QUFDakMsV0FBT0osOEJBQThCLENBQUNLLFVBQUQsQ0FBOUIsSUFBOENwQixPQUFyRDtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU9BLE9BQVA7QUFDRDtBQUNGOztBQUVELE1BQU1zQixlQUFlLEdBQUcsQ0FDdEJ0QixPQURzQixFQUV0QlEsT0FGc0IsRUFHdEJKLE9BSHNCLEVBSXRCRCxPQUpzQixFQUt0QkUsT0FMc0IsRUFNdEJDLEtBTnNCLEVBT3RCQyxlQVBzQixDQUF4Qjs7QUFVTyxTQUFTZ0Isb0JBQVQsQ0FBOEIsR0FBR0MsUUFBakMsRUFBMkM7QUFDaEQsTUFBSUMsZUFBZSxHQUFHLENBQXRCO0FBQ0EsTUFBSUMscUJBQXFCLEdBQUdsQixPQUE1Qjs7QUFDQSxPQUFLLE1BQU1XLE1BQVgsSUFBcUJLLFFBQXJCLEVBQStCO0FBQzdCLFVBQU1HLFFBQVEsR0FBR0wsZUFBZSxDQUFDTSxPQUFoQixDQUF3QlQsTUFBeEIsQ0FBakI7O0FBQ0EsUUFBSVEsUUFBUSxHQUFHRixlQUFmLEVBQWdDO0FBQzlCQSxNQUFBQSxlQUFlLEdBQUdFLFFBQWxCO0FBQ0FELE1BQUFBLHFCQUFxQixHQUFHUCxNQUF4QjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBT08scUJBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbW1pdCBvciBwdWxsIHJlcXVlc3QgYnVpbGQgc3RhdHVzLCB1bmlmaWVkIGZyb20gdGhvc2UgZGVyaXZlZCBmcm9tIHRoZSBDaGVja3MgQVBJIGFuZCB0aGUgU3RhdHVzIEFQSS5cblxuY29uc3QgREVGQVVMVCA9IHtcbiAgaWNvbjogJ3VudmVyaWZpZWQnLFxuICBjbGFzc1N1ZmZpeDogJ3BlbmRpbmcnLFxufTtcblxuY29uc3QgUEVORElORyA9IHtcbiAgaWNvbjogJ3ByaW1pdGl2ZS1kb3QnLFxuICBjbGFzc1N1ZmZpeDogJ3BlbmRpbmcnLFxufTtcblxuY29uc3QgU1VDQ0VTUyA9IHtcbiAgaWNvbjogJ2NoZWNrJyxcbiAgY2xhc3NTdWZmaXg6ICdzdWNjZXNzJyxcbn07XG5cbmNvbnN0IEZBSUxVUkUgPSB7XG4gIGljb246ICd4JyxcbiAgY2xhc3NTdWZmaXg6ICdmYWlsdXJlJyxcbn07XG5cbmNvbnN0IEVSUk9SID0ge1xuICBpY29uOiAnYWxlcnQnLFxuICBjbGFzc1N1ZmZpeDogJ2ZhaWx1cmUnLFxufTtcblxuY29uc3QgQUNUSU9OX1JFUVVJUkVEID0ge1xuICBpY29uOiAnYmVsbCcsXG4gIGNsYXNzU3VmZml4OiAnZmFpbHVyZScsXG59O1xuXG5jb25zdCBORVVUUkFMID0ge1xuICBpY29uOiAnZGFzaCcsXG4gIGNsYXNzU3VmZml4OiAnbmV1dHJhbCcsXG59O1xuXG5jb25zdCBTVEFUVVNfQ09OVEVYVF9NQVAgPSB7XG4gIEVYUEVDVEVEOiBQRU5ESU5HLCBQRU5ESU5HLCBTVUNDRVNTLCBFUlJPUiwgRkFJTFVSRSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFN0YXR1c0Zyb21TdGF0dXNDb250ZXh0KHtzdGF0ZX0pIHtcbiAgcmV0dXJuIFNUQVRVU19DT05URVhUX01BUFtzdGF0ZV0gfHwgREVGQVVMVDtcbn1cblxuY29uc3QgUEVORElOR19DSEVDS19TVEFUVVNFUyA9IG5ldyBTZXQoWydRVUVVRUQnLCAnSU5fUFJPR1JFU1MnLCAnUkVRVUVTVEVEJ10pO1xuXG5jb25zdCBDT01QTEVURURfQ0hFQ0tfQ09OQ0xVU0lPTl9NQVAgPSB7XG4gIFNVQ0NFU1MsIEZBSUxVUkUsIFRJTUVEX09VVDogRVJST1IsIENBTkNFTExFRDogRVJST1IsIEFDVElPTl9SRVFVSVJFRCwgTkVVVFJBTCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFN0YXR1c0Zyb21DaGVja1Jlc3VsdCh7c3RhdHVzLCBjb25jbHVzaW9ufSkge1xuICBpZiAoUEVORElOR19DSEVDS19TVEFUVVNFUy5oYXMoc3RhdHVzKSkge1xuICAgIHJldHVybiBQRU5ESU5HO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ0NPTVBMRVRFRCcpIHtcbiAgICByZXR1cm4gQ09NUExFVEVEX0NIRUNLX0NPTkNMVVNJT05fTUFQW2NvbmNsdXNpb25dIHx8IERFRkFVTFQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIERFRkFVTFQ7XG4gIH1cbn1cblxuY29uc3QgU1RBVFVTX1BSSU9SSVRZID0gW1xuICBERUZBVUxULFxuICBORVVUUkFMLFxuICBTVUNDRVNTLFxuICBQRU5ESU5HLFxuICBGQUlMVVJFLFxuICBFUlJPUixcbiAgQUNUSU9OX1JFUVVJUkVELFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVCdWlsZFN0YXR1c2VzKC4uLnN0YXR1c2VzKSB7XG4gIGxldCBoaWdoZXN0UHJpb3JpdHkgPSAwO1xuICBsZXQgaGlnaGVzdFByaW9yaXR5U3RhdHVzID0gTkVVVFJBTDtcbiAgZm9yIChjb25zdCBzdGF0dXMgb2Ygc3RhdHVzZXMpIHtcbiAgICBjb25zdCBwcmlvcml0eSA9IFNUQVRVU19QUklPUklUWS5pbmRleE9mKHN0YXR1cyk7XG4gICAgaWYgKHByaW9yaXR5ID4gaGlnaGVzdFByaW9yaXR5KSB7XG4gICAgICBoaWdoZXN0UHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgIGhpZ2hlc3RQcmlvcml0eVN0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpZ2hlc3RQcmlvcml0eVN0YXR1cztcbn1cbiJdfQ==