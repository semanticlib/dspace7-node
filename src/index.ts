import Operation from './utils/operation'
import Api from './services/dspace.api'

const DSpace: any = {
  init: (url: string, agent = 'DSpace NodeJs Client') => Api.init(url, agent),
  login: (user: string, pass: string) => Api.auth.login(user, pass),
  Api,
  Operation
}

export default DSpace
