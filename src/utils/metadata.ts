class Metadata {
  static newCollection(name: string) {
    return {
      name,
      metadata: {
        'dc.title': [
          {
            value: name,
            language: null,
            authority: null,
            confidence: -1
          }
        ]
      }
    }
  }

  static newBitstream(name: string, place = 0, filename?: string) {
    return {
      name,
      metadata: {
        'dc.description': [
          {
            value: filename || name,
            language: null,
            authority: null,
            confidence: -1,
            place
          }
        ]
      },
      bundleName: 'ORIGINAL'
    }
  }
}

export default Metadata
