import { ReactNode } from 'react';
import { Position } from 'unist';

export type ComponentPropsWithoutRef<T extends React.ElementType<any>> =
  import('react').ComponentPropsWithoutRef<T>;

export type ReactMarkdownProps = {
  node: Element;
  children: ReactNode[];
  /**
   * Passed when `options.rawSourcePos` is given
   */
  sourcePosition?: Position;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  index?: number;
  /**
   * Passed when `options.includeElementIndex` is given
   */
  siblingCount?: number;
};

export type CodeProps = ComponentPropsWithoutRef<'code'> &
  ReactMarkdownProps & {
    inline?: boolean;
  };
