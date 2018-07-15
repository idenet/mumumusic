import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// css
import './header.styl'

export default class Header extends Component {
	render() {
		return (
			<div className="header">
				<div className="header-text">mumu Music</div>
				<Link className="header-mine" to="/user">
					<i className="icon-mine" />
				</Link>
			</div>
		)
	}
}
