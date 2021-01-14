import { useEffect } from 'react'

const Banner = () => {
  const content =
    '🙋‍♀️ 🙋‍♂️ Contributors & adopters, take the community&nbsp;<a href="https://bit.ly/3i3v2Vr" target="_blank">survey</a>&nbsp;and claim your Chaos Mesh anniversary swag!'

  useEffect(() => {
    if (document.body.contains(document.querySelector('#banner'))) {
      return
    }

    const d = document.createElement('div')
    d.id = 'banner'
    d.innerHTML = content

    document.querySelector('#__docusaurus').prepend(d)
  }, [])

  return null
}

export default Banner
