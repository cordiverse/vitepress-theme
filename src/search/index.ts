import { MeiliSearch } from 'meilisearch'
import { buildDocs } from './docs-builder'
import { fileURLToPath } from 'url'

namespace SearchPlugin {
  export interface Options {
    indexName: string
    host: string
    readKey?: string
    writeKey?: string
  }
}

function SearchPlugin({ host, indexName, readKey = '', writeKey = '' }: SearchPlugin.Options) {
  const client = new MeiliSearch({ host, apiKey: writeKey })
  const index = client.index(indexName)
  let config

  async function publishIndex() {
    const docs = await buildDocs(config.root)
    await index.deleteAllDocuments()
    await index.addDocumentsInBatches(docs, 1000)
    await index.updateSearchableAttributes([
      'sentence',
      'lvl6',
      'lvl5',
      'lvl4',
      'lvl3',
      'lvl2',
      'lvl1',
      'alternate',
    ])
    await index.updateFilterableAttributes(['locale'])
    await index.updateSortableAttributes(['pageLink'])
    await index.updateRankingRules([
      'exactness',
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'pageLink:asc',
    ])
    await index.updateDistinctAttribute('link')
  }

  return {
    name: 'vite-plugin-search',
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    config: () => {
      return {
        define: {
          __VITE_MEILISEARCH_HOST__: JSON.stringify(host),
          __VITE_MEILISEARCH_INDEX__: JSON.stringify(indexName),
          __VITE_MEILISEARCH_APIKEY__: JSON.stringify(readKey),
        },
        resolve: {
          alias: {
            './VPNavBarSearch.vue': fileURLToPath(new URL('../client/components/navbar-search.vue', import.meta.url)),
          },
        },
      }
    },

    async buildEnd() {
      await publishIndex()
    },
  }
}

export default SearchPlugin
