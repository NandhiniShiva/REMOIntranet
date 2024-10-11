
// // import * as React from 'react';
// // import { IDisplayProps, IDisplayState } from './IHelloWorldProps';



// // export default class Display extends React.Component<IDisplayProps, IDisplayState> {
// //     constructor(props: IDisplayProps) {
// //         super(props);
// //         this.state = {
// //             selectedImage: props.image,
// //             selectedVideo: props.video || (props.videos.length > 0 ? props.videos[0] : null), 
// //             showImages: !props.video, 
// //             videos: props.videos,
// //             images:props.images
// //         };
// //     }

// //     private handleVideosClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
// //         this.setState({ 
// //           showImages: false,
// //           selectedVideo: this.state.videos.length > 0 ? this.state.videos[0] : null
// //         });
// //         event.preventDefault();
// //     }

// //     private handleImagesClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
// //         event.preventDefault();
// //         if (this.state.images.length > 0) {
// //             this.setState({ 
// //                 showImages: true,
// //                 selectedImage: this.state.images[0] 
// //             });
// //         } else {
// //             this.setState({ showImages: true });
// //         }
// //     }
    

// //     private handleThumbnailClick = (item: any): void => {
// //         this.setState({ selectedImage: item });
// //     }

// //     private handleVideoThumbnailClick = (video: any): void => {
// //         this.setState({ selectedVideo: video });
// //     }

// //     public render(): React.ReactElement<IDisplayProps> {
// //         const { onBack, images: propsImages} = this.props;
// //         const { selectedImage, selectedVideo, showImages, images: stateImages, videos } = this.state;
    
// //         const imagesToDisplay = showImages ? stateImages : propsImages;
    
// //         return (
// //             <div>
// //                 <div className="lightbox">
// //                     <div className="gallery-lightbox-contents">
// //                         <div className="lightbox-contents-img">
// //                             <div className="lightbox-contents-header clearfix">
// //                                 <h4>{showImages ? selectedImage?.Name : selectedVideo?.Name || 'No selection'}</h4>
// //                                 <ul>
// //                                     {videos.length > 0 && !showImages && (
// //                                         <li>
// //                                             <a href="#" onClick={this.handleImagesClick}>
// //                                                 Images
// //                                             </a>
// //                                         </li>
// //                                     )}
// //                                     {showImages && videos.length > 0 && (
// //                                         <li>
// //                                             <a href="#" onClick={this.handleVideosClick}>
// //                                                 Videos
// //                                             </a>
// //                                         </li>
// //                                     )}
// //                                 </ul>
// //                             </div>
    
// //                             <div className="lightbox-contents-body">
// //                                 {showImages ? (
// //                                     <div className="image-section">
// //                                         {selectedImage ? (
// //                                             <img
// //                                                 src={selectedImage.ServerRelativeUrl}
// //                                                 alt={selectedImage.Name}
// //                                                 style={{ width: '100%', borderRadius: '10px' }}
// //                                             />
// //                                         ) : (
// //                                             <p>No image selected.</p>
// //                                         )}
// //                                         <div className="lightbox-conent-thumbnails">
// //                                             <ul className="clearfix">
// //                                                 {imagesToDisplay.map((image, index) => (
// //                                                     <li
// //                                                         key={index}
// //                                                         className={
// //                                                             selectedImage &&
// //                                                             selectedImage.ServerRelativeUrl === image.ServerRelativeUrl
// //                                                                 ? 'active'
// //                                                                 : ''
// //                                                         }
// //                                                         style={{
// //                                                             listStyle: 'none',
// //                                                             cursor: 'pointer',
// //                                                             width: '150px',
// //                                                             border: 'none',
// //                                                         }}
// //                                                     >
// //                                                         <a href="#" onClick={() => this.handleThumbnailClick(image)}>
// //                                                             <img
// //                                                                 src={image.ServerRelativeUrl}
// //                                                                 alt={image.Name}
// //                                                                 style={{ width: '100%', borderRadius: '10px' }}
// //                                                             />
// //                                                         </a>
// //                                                     </li>
// //                                                 ))}
// //                                             </ul>
// //                                         </div>
// //                                     </div>
// //                                 ) : (
// //                                     <div className="video-section">
// //                                         <div className="selected-video">
// //                                             {selectedVideo ? (
// //                                                 <video
// //                                                     src={selectedVideo.ServerRelativeUrl}
// //                                                     controls
// //                                                     style={{ width: '100%', height: '400px', borderRadius: '10px' }}
// //                                                 />
// //                                             ) : (
// //                                                 <p>No video selected.</p>
// //                                             )}
// //                                         </div>
// //                                         <div className="video-thumbnails">
// //                                             <ul className="clearfix">
// //                                                 {videos.map((video, index) => (
// //                                                     <li
// //                                                         key={index}
// //                                                         className={
// //                                                             selectedVideo &&
// //                                                             selectedVideo.ServerRelativeUrl === video.ServerRelativeUrl
// //                                                                 ? 'active'
// //                                                                 : ''
// //                                                         }
// //                                                         style={{
// //                                                             listStyle: 'none',
// //                                                             cursor: 'pointer',
// //                                                             width: '150px',
// //                                                             border: 'none',
// //                                                         }}
// //                                                     >
// //                                                         <a href="#" onClick={() => this.handleVideoThumbnailClick(video)}>
// //                                                             <video
// //                                                                 src={video.ServerRelativeUrl}
// //                                                                 width="150"
// //                                                                 height="150"
// //                                                                 style={{ width: '100%', borderRadius: '10px' }}
// //                                                             />
// //                                                         </a>
// //                                                     </li>
// //                                                 ))}
// //                                             </ul>
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                             <div className="lightbox-close" onClick={onBack}>
// //                                 <img
// //                                     src="https://3c3tsp.sharepoint.com/sites/demosite/siteone/training11/GallerySite/SiteAssets/Images/close.svg"
// //                                     alt="close"
// //                                 />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }
// // }

// import * as React from 'react';
// // import { IDisplayProps, IDisplayState } from './IGalleryGridViewProps';

// export default class Display extends React.Component<IDisplayProps, IDisplayState> {
//     constructor(props: IDisplayProps) {
//         super(props);
//         this.state = {
//             selectedImage: props.image,
//             selectedVideo: props.video || (props.videos.length > 0 ? props.videos[0] : null), 
//             showImages: !props.video, 
//             videos: props.videos,
//             images: props.images
//         };
//     }

//     private handleVideosClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
//         this.setState({ 
//           showImages: false,
//           selectedVideo: this.state.videos.length > 0 ? this.state.videos[0] : null
//         });
//         event.preventDefault();
//     }

//     private handleImagesClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
//         event.preventDefault();
//         if (this.state.images.length > 0) {
//             this.setState({ 
//                 showImages: true,
//                 selectedImage: this.state.images[0] 
//             });
//         } else {
//             this.setState({ showImages: true });
//         }
//     }

//     private handleThumbnailClick = (item: any): void => {
//         this.setState({ selectedImage: item });
//     }

//     private handleVideoThumbnailClick = (video: any): void => {
//         this.setState({ selectedVideo: video });
//     }

    

//     public render(): React.ReactElement<IDisplayProps> {
//         const { onBack } = this.props;
//         const { selectedImage, selectedVideo, showImages, images, videos } = this.state;
    
//         const thumbnailImages = selectedImage ? images.filter((image: { ServerRelativeUrl: { includes: (arg0: any) => any; }; }) => image.ServerRelativeUrl.includes(selectedImage.ServerRelativeUrl.slice(0, selectedImage.ServerRelativeUrl.lastIndexOf('/')))) : images;
//         const thumbnailVideos = selectedVideo ? videos.filter((video: { ServerRelativeUrl: { includes: (arg0: any) => any; }; }) => video.ServerRelativeUrl.includes(selectedVideo.ServerRelativeUrl.slice(0, selectedVideo.ServerRelativeUrl.lastIndexOf('/')))) : videos;
    
//         return (
//             <div>
//                 <div className="lightbox">
//                     <div className="gallery-lightbox-contents">
//                         <div className="lightbox-contents-img">
//                             <div className="lightbox-contents-header clearfix">
//                                 <h4>{showImages ? selectedImage?.Name : selectedVideo?.Name || 'No selection'}</h4>
//                                 <ul>
//                                     {videos.length > 0 && !showImages && (
//                                         <li>
//                                             <a href="#" onClick={this.handleImagesClick}>
//                                                 Images
//                                             </a>
//                                         </li>
//                                     )}
//                                     {showImages && videos.length > 0 && (
//                                         <li>
//                                             <a href="#" onClick={this.handleVideosClick}>
//                                                 Videos
//                                             </a>
//                                         </li>
//                                     )}
//                                 </ul>
//                             </div>
    
//                             <div className="lightbox-contents-body">
//                                 {showImages ? (
//                                     <div className="image-section">
//                                         {selectedImage ? (
//                                             <img
//                                                 src={selectedImage.ServerRelativeUrl}
//                                                 alt={selectedImage.Name}
//                                                 style={{ width: '100%', borderRadius: '10px' }}
//                                             />
//                                         ) : (
//                                             <p>No image selected.</p>
//                                         )}
//                                         <div className="lightbox-conent-thumbnails">
//                                             <ul className="clearfix">
//                                                 {thumbnailImages.map((image: { ServerRelativeUrl: string; Name: string; }, index: React.Key) => (
//                                                     <li
//                                                         key={index}
//                                                         className={
//                                                             selectedImage &&
//                                                             selectedImage.ServerRelativeUrl === image.ServerRelativeUrl
//                                                                 ? 'active'
//                                                                 : ''
//                                                         }
//                                                         style={{
//                                                             listStyle: 'none',
//                                                             cursor: 'pointer',
//                                                             width: '150px',
//                                                             border: 'none',
//                                                         }}
//                                                     >
//                                                         <a href="#" onClick={() => this.handleThumbnailClick(image)}>
//                                                             <img
//                                                                 src={image.ServerRelativeUrl}
//                                                                 alt={image.Name}
//                                                                 style={{ width: '100%', borderRadius: '10px' }}
//                                                             />
//                                                         </a>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="video-section">
//                                         <div className="selected-video">
//                                             {selectedVideo ? (
//                                                 <video
//                                                     src={selectedVideo.ServerRelativeUrl}
//                                                     controls
//                                                     style={{ width: '100%', height: '400px', borderRadius: '10px' }}
//                                                 />
//                                             ) : (
//                                                 <p>No video selected.</p>
//                                             )}
//                                         </div>
//                                         <div className="video-thumbnails">
//                                             <ul className="clearfix">
//                                                 {thumbnailVideos.map((video: { ServerRelativeUrl: string; }, index: React.Key) => (
//                                                     <li
//                                                         key={index}
//                                                         className={
//                                                             selectedVideo &&
//                                                             selectedVideo.ServerRelativeUrl === video.ServerRelativeUrl
//                                                                 ? 'active'
//                                                                 : ''
//                                                         }
//                                                         style={{
//                                                             listStyle: 'none',
//                                                             cursor: 'pointer',
//                                                             width: '150px',
//                                                             border: 'none',
//                                                         }}
//                                                     >
//                                                         <a href="#" onClick={() => this.handleVideoThumbnailClick(video)}>
//                                                             <video
//                                                                 src={video.ServerRelativeUrl}
//                                                                 width="150"
//                                                                 height="150"
//                                                                 style={{ width: '100%', borderRadius: '10px' }}
//                                                             />
//                                                         </a>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="lightbox-close" onClick={onBack}>
//                                 <img
//                                     src="https://3c3tsp.sharepoint.com/sites/demosite/siteone/training11/GallerySite/SiteAssets/Images/close.svg"
//                                     alt="close"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }