import dspaceApi from '../services/dspace.api'
import {readFileSync} from 'fs'
import Metadata from './metadata'

class Operation {

  static async showAllItems() {
    try {
      const res = await dspaceApi.items.all()
      const itemList = res._embedded.items
      let count = 0
      for (const item of itemList) {
        console.log(`${++count}. Title: ${item.name} (handle: ${item.handle})`)
        console.log(`    ${item._links.self.href}`)
        // console.log(item.lastModified)
      }
    } catch (e: any) {
      console.log(`Error getting item: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async showItem(itemId: string) {
    try {
      const item = await dspaceApi.items.byId(itemId)
      console.log(`${item.name} (handle: ${item.handle}, id: ${item.uuid})`)
      console.log(`URL: ${item._links.self.href}`)
    } catch (e: any) {
      console.log(`Error getting item with id: ${itemId}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async showItemBundles(itemId: string, type?: string) {
    try {
      const res = await dspaceApi.bundles.byItemId(itemId)
      const bundles = type
        ? res._embedded.bundles.filter(bundle => bundle.name === type)
        : res._embedded.bundles
      for (const bundle of bundles) {
        console.log(`${bundle.name} (Bundle id: ${bundle.uuid})`)
        console.log(`URL: ${bundle._links.self.href}`)
        await this.showBitstreams(bundle.uuid)
      }
    } catch (e: any) {
      console.log(`Error getting bundles with item id: ${itemId}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async showBitstreams(bundleId: string) {
    try {
      const res = await dspaceApi.bitstreams.byBundleId(bundleId)
      const bitstreams = res._embedded.bitstreams
      bitstreams.forEach(bitstream => {
        console.log(`\t${bitstream.name} (size: ${bitstream.sizeBytes}, Bitstream id: ${bitstream.uuid})`)
        console.log(`\tContent: ${bitstream._links.content.href}`)
        console.log(`\tThumbnail: ${bitstream._links.thumbnail.href}\n`)
      })
    } catch (e: any) {
      console.log(`\tError getting bitstreams with bundle id: ${bundleId}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async newBitstream(itemId: string, name: string, filePath: string) {
    try {
      const bundleId = await this.getContentBundleId(itemId)
      if (bundleId.length) {
        const formData = new FormData()
        const contents = new Blob([readFileSync(`${filePath}/${name}`)])
        const properties = `${JSON.stringify(Metadata.newBitstream(name))};type=application/json`
        formData.append('file', contents, name)
        formData.append('properties', properties)
        // console.log(contents, properties)
        await dspaceApi.bitstreams.create(bundleId, formData)
        console.log(`Bitstream created in item: ${itemId}`)
      } else {
        console.log(`Error in getting bundleId: ${itemId}`)
      }
    } catch (e: any) {
      console.log(`Create bitstream failed: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async getContentBundleId(itemId: string) {
    let bundleId = ''
    try {
      const res = await dspaceApi.bundles.byItemId(itemId)
      // const bundles = res._embedded.bundles.find(bundle => bundle.name === 'ORIGINAL')
      const bundle = res._embedded.bundles.find(bundle => bundle.name === 'ORIGINAL')
      bundleId = bundle ? bundle.uuid : ''
    } catch (e: any) {
      console.log(`Error getting bundle ID: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
    return bundleId
  }

  static async deleteBitstreams(bitstreamId: string) {
    try {
      await dspaceApi.bitstreams.delete(bitstreamId)
      console.log(`Bitstream deleted: ${bitstreamId}`)
    } catch (e: any) {
      console.log(`Delete bitstream (id: ${bitstreamId} failed: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async deleteBitstreamsByItemId(itemId: string) {
    try {
      const res = await dspaceApi.bundles.byItemId(itemId)
      const bundles = res._embedded.bundles.filter(bundle => bundle.name !== 'LICENSE')
      for (const bundle of bundles) {
        const bundleId = bundle.uuid
        if (bundleId.length) {
          const res = await dspaceApi.bitstreams.byBundleId(bundleId)
          const bitstreams = res._embedded.bitstreams
          for (const bitstream of bitstreams) {
            try {
              await dspaceApi.bitstreams.delete(bitstream.uuid)
              console.log(`Bitstream (bundle: ${bundle.name}) deleted: ${bitstream.name}`)
            } catch {
              console.log(`Delete bitstream (bundle: ${bundle.name}) failed for: ${bitstream.name}`)
            }
          }
        } else {
          console.log(`Error in getting bundleId: ${itemId}`)
        }
      }
      console.log(`Deleted bitstreams for itemId: ${itemId}`)
    } catch (e: any) {
      console.log(`Exception in deleting bitstreams for item: ${itemId}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async moveItem(itemId: string, colId: string) {
    try {
      await dspaceApi.items.move(itemId, colId)
      console.log(`Item moved to collection: ${colId}`)
    } catch (e: any) {
      console.log(`Item move failed for itemId: ${itemId}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async deleteCollection(colId: string) {
    try {
      await dspaceApi.collections.deleteById(colId)
      console.log(`Collection deleted: ${colId}`)
    } catch (e: any) {
      console.log(`Delete collection failed: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async createCollection(comId: string, name: string) {
    try {
      await dspaceApi.collections.create(comId, Metadata.newCollection(name))
      console.log(`Collection created: ${name}`)
    } catch (e: any) {
      console.log(`Create collection failed: ${e.errorCode}`)
      process.env.DEBUG && console.dir(e)
    }
  }

  static async showCollections() {
    try {
      const res = await dspaceApi.communities.top()
      const commList = res._embedded.communities
      console.log('----------------\nTop Communities\n----------------')
      for (const comm of commList) {
        console.log(`${comm.name} (id: ${comm.uuid})`)
        // console.log(comm._links.self.href)

        const res2 = await dspaceApi.collections.byComId(comm.uuid)
        const colList = res2._embedded.collections
        if (colList.length) {
          console.log('\t=> Collections')
          colList.forEach(col => {
            console.log(`\t${col.name} (id: ${col.uuid})`)
            // console.log(`\t${col._links.self.href}`)
          })
        }
      }
    } catch (e) {
      console.log('Error in getting collections')
      process.env.DEBUG && console.dir(e)
    }
  }

}

export default Operation
