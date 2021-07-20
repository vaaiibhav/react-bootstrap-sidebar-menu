import React, { useContext, useMemo } from 'react';
import { NavbarProps } from "react-bootstrap";
import { BsPrefixProps, BsPrefixRefForwardingComponent } from 'react-bootstrap/helpers';
import PropTypes from "prop-types";
import { useBootstrapPrefix } from 'react-bootstrap/ThemeProvider';
import SidebarMenuSubContext, { SidebarMenuSubContextProps } from './sidebar-menu-sub-context';
import SidebarMenuSubToggle from './sidebar-menu-sub-toggle';
import SidebarMenuSubCollapse from './sidebar-menu-sub-collapse';
import classNames from 'classnames';
import { EventKey } from 'react-bootstrap/types';
import SidebarMenuNode from './sidebar-menu-node';
import SidebarMenuNodeContext from './sidebar-menu-node-context';
import SidebarMenuContext from './sidebar-menu-context';
import { useUncontrolled } from 'uncontrollable';

type SidebarMenuSubProps = BsPrefixProps & Omit<NavbarProps,
  'sticky' | 'bg' | 'variant' | 'fixed' | 'expand' | 'collapseOnSelect' | 'onSelect' | 'role'
> & {
  eventKey?: EventKey
  expanded?: boolean,
  onToggle?: (expanded: boolean) => void
};

const propTypes = {

  /**
   * Set a custom element for this component.
   */
  as: PropTypes.elementType,

  /**
   * A callback fired when the `<SidebarMenuSub>` body collapses or expands. Fired when
   * a `<SidebarMenuSub.Toggle>` is clicked and called with the new `expanded`
   * boolean value.
   *
   * @controllable expanded
   */
  onToggle: PropTypes.func,

  /**
   * Controls the visiblity of the submenu body
   *
   * @controllable onToggle
   */
  expanded: PropTypes.bool,

  /**
   * The ARIA role for the SidebarMenuSub.
   *
   * @default 'navigation'
   */
  role: PropTypes.string
};

const SidebarMenuSub: BsPrefixRefForwardingComponent<'div', SidebarMenuSubProps> = React.forwardRef(({
  bsPrefix: initialBsPrefix,
  as: Component = 'div',
  eventKey,
  className,
  ...props
}: SidebarMenuSubProps, ref) => {

  const {
    expanded,
    onToggle
  } = useUncontrolled(props, {
    expanded: 'onToggle'
  });

  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'sidebar-menu-sub');

  const { activeKey: parentActiveKey, onSelect: onParentSelect } = useContext(SidebarMenuNodeContext);
  const { exclusiveExpand } = useContext(SidebarMenuContext)
  
  const subContext = useMemo<SidebarMenuSubContextProps>(
    () => ({
      bsPrefix,
      eventKey,
      activeKey: parentActiveKey,
      onSelect: (eventKey?: EventKey | null) => { onParentSelect?.(eventKey) },
      onToggle: () => onToggle?.(!expanded),
      expanded: exclusiveExpand ? eventKey === parentActiveKey : !!expanded,
    }),
    [bsPrefix, eventKey, exclusiveExpand, expanded, onParentSelect, onToggle, parentActiveKey]
  );

  return <SidebarMenuSubContext.Provider value={subContext}>
    <SidebarMenuNode with={Component} ref={ref} className={classNames(className, bsPrefix)} {...props} />
  </SidebarMenuSubContext.Provider>;
});

SidebarMenuSub.displayName = "SidebarMenuSub";
SidebarMenuSub.propTypes = propTypes;

export default Object.assign(SidebarMenuSub, {
  Collapse: SidebarMenuSubCollapse,
  Toggle: SidebarMenuSubToggle
});

