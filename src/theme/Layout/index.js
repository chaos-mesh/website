import Layout from '@theme-original/Layout'

import CalComPopupEmbed from '../../components/CalComPopupEmbed'

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <CalComPopupEmbed />
    </>
  )
}
