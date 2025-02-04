'use client';

import myInfo from '../presetInfo';
import SideChatbox from './SideChatbox';
import WorldMap from './WorldMap';

export default function Page() {
    return (
        <div>
            <WorldMap />
            <SideChatbox />
        </div>
    );
} 