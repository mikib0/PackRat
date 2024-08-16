import React from 'react';
import { useNavigationList } from 'app/hooks/navigation';
import { NavigationItem } from '../NavigationItem';
import { useIsMobileView } from 'app/hooks/common';
import { View } from 'tamagui';
import useTheme from '../../../hooks/useTheme';

interface ProfileNavigationList {
  itemStyle?: any;
  onItemSelect?: (item: any) => void;
}

export const ProfileNavigationList = ({ itemStyle, onItemSelect }) => {
  const isMobileView = useIsMobileView();
  const { currentTheme } = useTheme();
  const { navigationItems } = useNavigationList();

  return (
    <>
      {navigationItems
        ?.filter(({ href }) => href === '/profile' || href === '/logout')
        .map(({ type, ...Item }, index) => {
          const item = Item as any;
          console.log(item);

          return (
            <View
              style={{
                width: '100%',
                borderRadius: 8,
                marginBottom: isMobileView ? 6 : 0,
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.white,
              }}
              hoverStyle={{
                bg: currentTheme.colors.secondaryBlue as any,
              }}
              key={item.href + index}
            >
              {type === 'link' ? (
                <NavigationItem
                  item={item}
                  itemStyle={itemStyle}
                  key={item.href + index}
                  onSelect={onItemSelect}
                  isMobileView={isMobileView}
                />
              ) : (
                item.Component && <item.Component />
              )}
            </View>
          );
        })}
    </>
  );
};