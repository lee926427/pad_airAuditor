/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
//#import "RNNotifications.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@import GoogleMaps;

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyClQlnWjkQtjujQSPEGDy3QGrXF75Fj2N8"]; //Google Map Authorize
  [RNNotifications startMonitorNotifications]; //push Notifications
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"pad_airAuditor"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
/*
- (void)application:(UIApplication *)application  didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{//push Notifications
  [RNNofifications didRegisterForRemoteNotificationsWithDeviceTokenToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationWithError:(NSError *)error{//push Notifications
  [RNNotifications didFailToRegisterForRemoteNotificationWithError:error];
}
*/
@end
