FROM nginx:1.23.3-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx
COPY build /etc/nginx/html
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]