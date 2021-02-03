import { useEffect } from 'react'

const Banner = () => {
  const content = ''

  useEffect(() => {
    if (document.body.contains(document.querySelector('#banner')) || window.closeBanner) {
      return
    }

    const d = document.createElement('div')
    d.id = 'banner'
    d.innerHTML = content

    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = 'x'
    close.onclick = () => {
      d.remove()

      window.closeBanner = true
    }

    d.append(close)

    document.querySelector('#__docusaurus').prepend(d)
  }, [])

  return null
}

export default Banner
