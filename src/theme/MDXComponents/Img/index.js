import Img from '@theme-original/MDXComponents/Img'
import React from 'react'

export default function ImgWrapper(props) {
  return (
    <figure>
      <Img {...props} />
      <figcaption
        className="text--italic text--center"
        style={{
          color: 'var(--ifm-color-content-secondary)',
          fontSize: '0.875rem',
        }}
      >
        {props.alt}
      </figcaption>
    </figure>
  )
}
