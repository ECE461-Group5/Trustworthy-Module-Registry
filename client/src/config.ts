// this will make your life easy due to our brother Abu Bakr

const port = 443; // 443 port# for https or 80 for http
const route = 'https://ec2-3-84-204-34.compute-1.amazonaws.com';
export const config = {
    appRoute: `${route}:${port}`,
};
