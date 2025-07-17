import { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

import IconCal from '../../static/img/icons/calendar.svg'

export default function CalComPopupEmbed() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: 'talk-to-chaos-mesh-maintainers' })
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <button
      className="tw-fixed tw-bottom-4 tw-right-4 tw-btn tw-btn-sm md:tw-btn-md tw-btn-primary tw-z-50 hover:-tw-translate-y-[3px]"
      data-cal-namespace="talk-to-chaos-mesh-maintainers"
      data-cal-link="strrl/talk-to-chaos-mesh-maintainers"
      data-cal-config='{"layout":"month_view"}'
    >
      <IconCal className="tw-w-4 tw-h-4 tw-mb-0.5 tw-fill-primary-content" />
      Schedule a Meeting
    </button>
  )
}
