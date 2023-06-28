export const getCurrentScopeInfo = () => {
  let fileName = '';
  let functionName = '';
  try {
    throw new Error;
  } catch (err) {
    const errObj = JSON.stringify(err, Object.getOwnPropertyNames(err));
    const stackLines = errObj.split('\\n'); // split 에서 개행처리시 \\ 필요
    // console.log('stacklines ', stackLines);
    const callerLine = stackLines[2].trim();
    functionName = callerLine.match(/at\s+(\S+)/)?.[1] || 'Unknown Function';
    fileName = callerLine.match(/\((.*):\d+:\d+\)$/)?.[1] || 'Unknown File';
  }
  return {
    fileName: fileName,
    functionName: functionName
  }
}