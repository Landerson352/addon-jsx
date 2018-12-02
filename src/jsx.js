import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import { ActionBar, ActionButton, themes } from '@storybook/components'
import ThemeProvider from '@emotion/provider'
import Prism from './prism'

import globalStyle from './css'

const prismStyle = document.createElement('style')
prismStyle.innerHTML = globalStyle
document.body.appendChild(prismStyle)

export default class JSX extends Component {
  constructor(props, ...args) {
    super(props, ...args)
    props.ob({
      next: type => (type === 'jsx' ? this.onAddJSX.bind(this) : this.setCurrent.bind(this)),
    })
    this.handleCopyClick = this.handleCopyClick.bind(this)

    this.state = {}
    this.stopListeningOnStory = () => this.setState({})
  }

  setCurrent(kind, story) {
    this.setState({ current: { kind, story } })
  }

  onAddJSX(kind, story, jsx) {
    const state = this.state

    if (typeof state[kind] === 'undefined') {
      state[kind] = {}
    }
    state[kind][story] = jsx
    this.setState(state)
  }

  handleCopyClick() {
    const { kind, story } = this.state.current
    const code = this.state[kind][story] || ''
    copy(code)
  }

  render() {
    if (!this.props.active) return null

    let jsx = ''
    let disabled = false
    if (
      typeof this.state.current !== 'undefined' &&
      typeof this.state[this.state.current.kind] !== 'undefined'
    ) {
      const current = this.state.current
      const code = this.state[current.kind][current.story]
      if (code) {
        jsx = Prism.highlight(code, Prism.languages.jsx)
      } else {
        disabled = true
      }
    } else {
      disabled = true
    }

    return (
      <ThemeProvider theme={themes.normal}>
        <div style={styles.container}>
          <pre style={styles.pre} dangerouslySetInnerHTML={{ __html: jsx }} />
          <ActionBar>
            <ActionButton disabled={disabled}>COPY</ActionButton>
          </ActionBar>
        </div>
      </ThemeProvider>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    height: '100%',
    backgroundColor: themes.normal.mainBackground,
  },
  pre: {
    flex: 1,
    overflowY: 'auto',
    padding: 10,
  },
}