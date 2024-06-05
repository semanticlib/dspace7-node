# DSpace Node

NodeJs client for DSpace 7 [REST API](https://github.com/DSpace/RestContract)

## Installation

```bash
npm install dspace7-node
```
or
```bash
yarn add dspace7-node
```

## Example Usage

Example of some of the operations currently supported:

```js
import DSpace from 'dspace7-node'

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

  // Add/delete collections
  const parentCommunityId = '5c1d0962-2a01-4563-9626-d14c964ca3ad'
  await DSpace.Operation.createCollection(parentCommunityId, 'Test Collection 2')
  const collectionId = 'e30cdb05-1909-4365-ab28-68d4534b174a'
  await DSpace.Operation.deleteCollection(collectionId)

  // Move item to another collection (change 'owningCollection')
  const itemId = '6641e0c5-10c7-4251-ba31-1d23f1bd2813'
  const targetCollection = 'dcbde2c8-b438-46e9-82ba-9e9e674aa3c5'
  await DSpace.Operation.moveItem(itemId, targetCollection)

  // Get bundle details
  await DSpace.Operation.showItemBundles(itemId)
  await DSpace.Operation.showItemBundles(itemId, 'ORIGINAL')

  // Add/delete bitstreams
  const bitstreamId = '4478411f-b01f-490c-a16a-59e9c9c558d9'
  await DSpace.Operation.newBitstream(itemId, 'Test Item 1.pdf', 'C:/temp/files')
  await DSpace.Operation.Operation.deleteBitstreams(bitstreamId)
  await DSpace.Operation.Operation.deleteBitstreamsByItemId(itemId)  // in all bundles, except 'LICENSE'
})()


```

## Call the API methods

Example of calling the main API methods directly:

```js
import DSpace from 'dspace7-node'

(async () => {
  const baseUrl = '' // e.g., https://demo.dspace.org/server
  const user = ''
  const password = ''

  // Init and login
  DSpace.init(baseUrl)
  await DSpace.login(user, password)

  // All communities
  const res = await DSpace.Api.communities.all(30) // limit to size 30
  console.log(res._embedded.communities)

  // Show sub-communities
  const parentCommunityId = '1f357420-6d26-4079-b581-7eee816322f0'
  const data = await DSpace.Api.communities.subById(parentCommunityId)
  console.log(data._embedded.subcommunities)

})()


```

## Features

- Show communities/subcommunities/collections
- Show items/bundles/bitstreams
- Add/delete communities/collections
- Move items between collections
- Add/delete bitstreams

## Tests

TO DO
