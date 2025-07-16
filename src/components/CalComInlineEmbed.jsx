import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

export default function CalComInlineEmbed() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: 'talk-to-chaos-mesh-maintainers' })
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <Cal
      namespace="talk-to-chaos-mesh-maintainers"
      calLink="strrl/talk-to-chaos-mesh-maintainers"
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
    />
  )
}
