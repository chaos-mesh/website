import React from 'react'
import Card from './Card'
import CodeBlock from '@theme/CodeBlock'

export default function CodeGrid() {
  return (
    <>
      <Card className="scroll-to-display-x">
        <h3>PodChaos / pod-failure</h3>
        <CodeBlock className="language-yaml !tw-mb-0 !tw-shadow-none [&_code]:tw-pt-0">
          {`
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure-example
  namespace: chaos-mesh
spec:
  selector:
    labelSelectors:
      'environment': 'staging'
  mode: one
  action: pod-failure
  duration: 30s
`}
        </CodeBlock>
      </Card>

      <Card className="scroll-to-display-x lg:tw-relative lg:tw-top-12">
        <h3>NetworkChaos / delay</h3>
        <CodeBlock className="language-yaml !tw-mb-0 !tw-shadow-none [&_code]:tw-pt-0">
          {`
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay-example
spec:
  selector:
    namespaces:
      - default
    labelSelectors:
      'env': 'production'
  mode: one
  action: delay
  delay:
    latency: '10ms'
    correlation: '100'
    jitter: '0ms'
`}
        </CodeBlock>
      </Card>

      <Card className="scroll-to-display-x">
        <h3>StressChaos</h3>
        <CodeBlock className="language-yaml !tw-mb-0 !tw-shadow-none [&_code]:tw-pt-0">
          {`
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: mem-stress
  namespace: chaos-mesh
spec:
  selector:
    namespaces:
      - 'default'
    labelSelectors:
      'env': 'test'
  mode: one
  stressors:
    memory:
      workers: 2
      size: '128MB'
`}
        </CodeBlock>
      </Card>
    </>
  )
}
