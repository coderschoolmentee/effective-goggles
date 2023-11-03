import { useParams } from 'react-router-dom'

function DetailPage () {
  const params = useParams()
  return (
    <div>
      <h1>DetailPage - ProductId: {params.id}</h1>
    </div>
  )
}

export default DetailPage
