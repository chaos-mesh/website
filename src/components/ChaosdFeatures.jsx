import React from 'react'
import Card from './Card'

import IconDisk from '../../static/img/icons/disk.svg'
import IconJava from '../../static/img/icons/java.svg'
import IconNetwork from '../../static/img/icons/network.svg'
import IconProcess from '../../static/img/icons/process.svg'
import IconStress from '../../static/img/icons/stress.svg'
import IconTime from '../../static/img/icons/time.svg'

const iconList = [
  {
    name: 'disk',
    Icon: IconDisk,
  },
  {
    name: 'java',
    Icon: IconJava,
  },
  {
    name: 'network',
    Icon: IconNetwork,
  },
  {
    name: 'process',
    Icon: IconProcess,
  },
  {
    name: 'stress',
    Icon: IconStress,
  },
  {
    name: 'time',
    Icon: IconTime,
  },
]

export default function ChaosdFeatures() {
  return (
    <div className="tw-grid tw-grid-cols-3 tw-gap-8">
      {iconList.map(({ name, Icon }) => (
        <Card key={name} className="tw-flex tw-bg-base-200">
          <Icon className="tw-w-8 tw-h-8 tw-select-none dark:tw-fill-white" />
        </Card>
      ))}
    </div>
  )
}
