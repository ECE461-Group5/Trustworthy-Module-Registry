// this will make your life easy due to our brother Abu Bakr

const port = 80; // 443 port# for https or 80 for http
const route = 'ec2-18-233-10-161.compute-1.amazonaws.com';// be careful this may get changed every time your start/stop the AWS instance
export const config = {
    appRoute: `${route}:${port}`,
};
