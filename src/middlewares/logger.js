import { inspect } from 'util' // https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
import { createLogger, format, transports } from 'winston' // https://github.com/winstonjs/winston#combining-formats
import { GQL_PATH, isProd } from '~env'
import { name as appName } from '../../package.json'

const { combine, printf } = format

const applabel = format.label({ label: appName })
const prodFormatter = printf(
  ({ message, label, timestamp }) => ` [${timestamp}] [${label}] ${message}`
)
const devFormatter = printf(({ level, message }) => `${level} ${message}`)
const appFormat = isProd
  ? combine(
    applabel,
    format.simple(),
    // format.splat(), // allow log.info('test message %d', 123)
    format.timestamp(),
    prodFormatter
  )
  : combine(
    format.colorize(),
    format.json(),
    applabel,
    format.timestamp(),
    format.simple(),
    // format.prettyPrint(),
    devFormatter
  )
export const log = createLogger({
  level: isProd ? 'error' : 'info',
  format: appFormat,
  transports: [new transports.Console()],
})

function graphqlReqFormat(
  request,
  { prefix = '', slice = 0, headers = false } = {}
) {
  if (isProd) {
    const body = JSON.stringify(request.body).replace(/(\s|\\n)+/g, '')
    return slice === 0 ? body : body.slice(0, slice)
  }
  let body = prefix
  // todo mutation, subscription
  const { operationName, variables, query } = request.body
  if (operationName === 'IntrospectionQuery') {
    body += chalk.blue.bold('IntrospectionQuery')
    return body
  }
  body += chalk.blue.bold(`${operationName || 'anonymous query'}`)
  if (query) {
    body += chalk.blue(`\n${query.replace(/(\n|\s)+/g, ' ')}`)
  }
  if (!_isEmpty(variables)) {
    body += chalk.yellow(`\n${JSON.stringify(variables)}`)
  }
  if (headers) {
    // console.log(JSON.stringify(ctx.request))
    const jwt = _get(request, 'header.authorization-token', 'undefined')
    body += chalk.cyan(`\n{ "Authorization-Token": "${jwt}" }`)
  }
  if (slice === 0) return body
  return body.slice(0, slice)
}

export const middleware = () => async (ctx, next) => {
  if (ctx.request.method !== 'POST') {
    await next()
    return
  }
  const start = Date.now() // vs performance.now() / +new Date() https://jsperf.com/gettime-vs-now-0/7
  await next()
  const ms = Date.now() - start
  let color = 'cyan'
  if (ms > 1000) color = 'yellow'
  else if (ms > 3000) color = 'red'
  const period = chalk[color](`${ms}ms`.padStart(7))
  // todo non-graphql request
  if (ctx.request.url !== GQL_PATH) {
    log.info(`[${chalk.bold(ctx.method)}|${period}] ${decodeURIComponent(ctx.request.body)}`)
    return
  }
  const body = graphqlReqFormat(ctx.request)
  // ctx.set('X-Response-Time', `${ms}ms`) // if needed

  const firstLine = chalk.bold(`[${period}] ${ctx.request.url}`)
  log.info(`${firstLine}\n${body}\n`)
}

export const logError = (err, scope, title, slice = 400) =>
  log.error(
    `[${scope.padStart(7)}] ${chalk.bold.red(title)} \n${inspect(err).slice(0, slice)}\n`
  )
