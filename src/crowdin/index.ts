import axios from 'axios'
import { Dict } from 'cosmokit'

interface Result<T> {
  data: T[]
  pagination: {
    offset: number
    limit: number
  }
}

interface File {
  revisionId: number
  status: string
  priority: string
  importOptions: {
    contentSegmentation: boolean
    customSegmentation: boolean
  }
  exportOptions: {
    exportPattern: string
  }
  excludedTargetLanguages: null
  createdAt: string
  updatedAt: string
  id: number
  projectId: number
  branchId: number
  directoryId: number
  name: string
  title: null
  type: string
  path: string
}

const limit = 250, margin = 25

export default async function crowdin(projectId: number, branchId: number) {
  const result: Dict<number> = {}
  const list = async (offset: number) => {
    // eslint-disable-next-line max-len
    const { data } = await axios.get<Result<{ data: File }>>(`https://api.crowdin.com/api/v2/projects/${projectId}/files?branchId=${branchId}&recursion=1&limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${process.env.CROWDIN_TOKEN}`,
      },
    })
    for (const { data: file } of data.data) {
      const path = file.path.split('/').slice(3).join('/')
      if (!path.endsWith('.md')) continue
      result[path] = file.id
    }
    return data.data.length >= limit
  }

  let offset = 0
  while (await list(offset)) {
    offset += limit - margin
  }
  console.log(result)
  return result
}
