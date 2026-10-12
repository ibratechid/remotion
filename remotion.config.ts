import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p'); // plays in Chrome, Safari, Adobe, everywhere
Config.setCodec('h264');
Config.setOverwriteOutput(true);
