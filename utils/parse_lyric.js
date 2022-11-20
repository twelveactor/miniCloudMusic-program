// 解析歌词
export function parseLyric(lyricString) {
  // console.log(lyricString);
  const lyricInfos = []

  // 处理歌词
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  const lyricLines = lyricString.split('\n')
  for (const line of lyricLines) {
    // console.log(line); // [00:00.000] 作词 : 刘冠南
    // 分离时间
    const lineTime = timeReg.exec(line) // ["[02:48.020]", "02", "48", "020"]
    // console.log(lineTime);
    if (lineTime === null) continue

    const minute = lineTime[1] * 60 * 1000  // 拿到分钟
    const second = lineTime[2] * 1000      // 拿到秒钟
    const mSecond = lineTime[3].length === 2 ? lineTime[3] * 10 : lineTime[3] * 1  // 拿到毫秒 ，两位 23 * 10 = 230 ， 110 *1 = 110
    const time = minute + second + mSecond
    // console.log(lineTime);
    // console.log(`分钟${minute}:秒钟${second}:毫秒${mSecond} = ${time}`);
    // 分离歌词
    const lineLyric = line.replace(timeReg , '')
    // console.log(lineLyric);

    const lyricLineObj = {
      text:lineLyric,
      time:time
    }

    lyricInfos.push(lyricLineObj)
  }


  return lyricInfos
}