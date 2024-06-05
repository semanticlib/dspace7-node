import DSpace from '../src/index'

(async () => {
  const baseUrl = '' // e.g., https://demo.dspace.org/server
  const user = ''
  const password = ''

  // Init and login
  DSpace.init(baseUrl)
  await DSpace.login(user, password)

  // Show list of top communities and its collections
  await DSpace.Operation.showCollections()
  await DSpace.Operation.showAllItems()

})()
