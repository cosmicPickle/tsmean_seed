import { userResource } from './../../resource/user';
import { groupResource } from './../../resource/group';
import AppResource from './../../core/routing/AppResource';
import { authResource } from '../../resource/auth';

export const resourceConfig: AppResource[] = [
    authResource,
    userResource,
    groupResource
];

export default resourceConfig;