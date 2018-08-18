import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';
import './antd-theme.less';

import './styles.scss';

injectGlobal`
  ${styledNormalize}
`;
