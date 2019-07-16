import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import { AtDrawer, AtActionSheet, AtToast } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../utils/api'
import './index.scss'

interface Page {
    id: string;
    start: number;
    end: number;
    desc: string;
}

export default class ReadPage extends Component {
    config: Config = {
    }

    state = {
        novelId: '',
        title: " 004 当死人来救",
        content: "<p>&#x3000;&#x3000;&#x201C;&#x5728;&#x90A3;&#x91CC;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x201C;&#x6211;&#x770B;&#x5230;&#x4ED6;&#x4EEC;&#x4E86;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x201C;&#x54D2;&#x54D2;&#x54D2;&#x54D2;&#x54D2;&#x54D2;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x4E00;&#x4E32;&#x5F39;&#x5934;&#x98DE;&#x6765;&#xFF0C;&#x628A;&#x65C1;&#x8FB9;&#x7684;&#x8349;&#x6728;&#x6253;&#x7684;&#x652F;&#x79BB;&#x7834;&#x788E;&#xFF0C;&#x65E0;&#x6570;&#x7684;&#x6811;&#x76AE;&#x5C51;&#x5F80;&#x845B;&#x9707;&#x7684;&#x8138;&#x4E0A;&#x5D29;&#x6765;&#x3002;</p><p>&#x3000;&#x3000;&#x6B66;&#x88C5;&#x5206;&#x5B50;&#x5DF2;&#x7ECF;&#x8D76;&#x5230;&#xFF01;</p><p>&#x3000;&#x3000;&#x201C;&#x9760;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x845B;&#x9707;&#x72E0;&#x72E0;&#x9A82;&#x4E86;&#x4E00;&#x58F0;&#xFF0C;&#x625B;&#x7740;&#x80E1;&#x6D77;&#x6D6A;&#x5411;&#x4E1B;&#x6797;&#x6DF1;&#x5904;&#x53D1;&#x8DB3;&#x72C2;&#x5954;&#xFF0C;&#x7A7F;&#x8FC7;&#x8302;&#x5BC6;&#x7684;&#x704C;&#x6728;&#x8349;&#x4E1B;&#xFF0C;&#x8D8A;&#x8FC7;&#x4E00;&#x9897;&#x9897;&#x4E0D;&#x77E5;&#x9053;&#x751F;&#x957F;&#x4E86;&#x591A;&#x4E45;&#x7684;&#x5927;&#x6811;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x55E4;&#x55E4;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x4E0D;&#x7BA1;&#x662F;&#x6811;&#x679D;&#x8FD8;&#x662F;&#x704C;&#x6728;&#x4E1B;&#xFF0C;&#x53C8;&#x6216;&#x8005;&#x8349;&#x4E1B;&#xFF0C;&#x5728;&#x9047;&#x5230;&#x73A9;&#x547D;&#x7684;&#x901F;&#x5EA6;&#x4E4B;&#x4E0B;&#xFF0C;&#x604D;&#x82E5;&#x4E00;&#x628A;&#x628A;&#x950B;&#x5229;&#x7684;&#x5200;&#x5B50;&#xFF0C;&#x5728;&#x4EBA;&#x8EAB;&#x4E0A;&#x8086;&#x610F;&#x5207;&#x5272;&#x3002;</p><p>&#x3000;&#x3000;&#x77ED;&#x77ED;&#x7684;&#x65F6;&#x95F4;&#x91CC;&#xFF0C;&#x845B;&#x9707;&#x9732;&#x51FA;&#x5728;&#x5916;&#x7684;&#x76AE;&#x80A4;&#x4E0A;&#x51FA;&#x73B0;&#x4E00;&#x9053;&#x53C8;&#x4E00;&#x9053;&#x72F0;&#x72DE;&#x7684;&#x8840;&#x53E3;&#xFF0C;&#x5411;&#x5916;&#x6E17;&#x7740;&#x8840;&#x6C34;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x54D2;&#x54D2;&#x54D2;&#x2026;&#x2026;&#x54D2;&#x54D2;&#x54D2;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x201C;&#x55D6;&#xFF01;&#x55D6;&#xFF01;&#x55D6;&#xFF01;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x4E00;&#x9897;&#x9897;&#x5F39;&#x5934;&#x4ECE;&#x540E;&#x9762;&#x98DE;&#x6765;&#xFF0C;&#x4ECE;&#x4ED6;&#x7684;&#x8EAB;&#x8FB9;&#x63A0;&#x8FC7;&#xFF0C;&#x5E26;&#x7ED9;&#x4ED6;&#x524D;&#x6240;&#x672A;&#x6709;&#x7684;&#x6B7B;&#x4EA1;&#x5A01;&#x80C1;&#x3002;</p><p>&#x3000;&#x3000;&#x800C;&#x5728;&#x5982;&#x6B64;&#x6050;&#x60E7;&#x7684;&#x5A01;&#x80C1;&#x4E2D;&#xFF0C;&#x4ED6;&#x7684;&#x5927;&#x8111;&#x601D;&#x8003;&#x80FD;&#x529B;&#x5DF2;&#x7ECF;&#x6D88;&#x5931;&#xFF0C;&#x53EA;&#x61C2;&#x5F97;&#x5411;&#x524D;&#x8DD1;&#xFF0C;&#x4E0D;&#x8981;&#x505C;&#x7684;&#x5411;&#x524D;&#x8DD1;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x5530;&#xFF01;&#x5530;&#xFF01;&#x5530;&#xFF01;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x5728;&#x625B;&#x7740;&#x4E00;&#x4E2A;&#x4EBA;&#x7684;&#x60C5;&#x51B5;&#x4E0B;&#xFF0C;&#x845B;&#x9707;&#x7A7F;&#x8FC7;&#x5C42;&#x5C42;&#x704C;&#x6728;&#x5BC6;&#x6797;&#xFF0C;&#x6E10;&#x6E10;&#x7684;&#x628A;&#x8EAB;&#x540E;&#x7684;&#x6B66;&#x88C5;&#x5206;&#x5B50;&#x7529;&#x5F00;&#x8DDD;&#x79BB;&#x3002;</p><p>&#x3000;&#x3000;&#x4ED6;&#x538B;&#x6839;&#x4E0D;&#x77E5;&#x9053;&#x81EA;&#x5DF1;&#x8DD1;&#x591A;&#x5FEB;&#xFF0C;&#x4E5F;&#x611F;&#x89C9;&#x4E0D;&#x5230;&#x8EAB;&#x4E0A;&#x7684;&#x75BC;&#x75DB;&#xFF0C;&#x9664;&#x4E86;&#x53CC;&#x811A;&#x7684;&#x52A8;&#x4F5C;&#xFF0C;&#x5C31;&#x662F;&#x90A3;&#x5F20;&#x8138;&#xFF1A;&#x773C;&#x775B;&#x77AA;&#x7684;&#x5706;&#x5706;&#x7684;&#xFF0C;&#x773C;&#x73E0;&#x5B50;&#x5411;&#x5916;&#x51F8;&#x51FA;&#xFF0C;&#x5634;&#x5DF4;&#x5927;&#x5F20;&#xFF0C;&#x820C;&#x5934;&#x6643;&#x52A8;&#xFF0C;&#x4ECE;&#x5634;&#x89D2;&#x6EF4;&#x843D;&#x6DF7;&#x7740;&#x8840;&#x6DB2;&#x7684;&#x53E3;&#x6C34;&#x3002;</p><p>&#x3000;&#x3000;&#x2026;&#x2026;</p><p>&#x3000;&#x3000;&#x201C;&#x4E0A;&#x6821;&#xFF0C;&#x5931;&#x53BB;&#x76EE;&#x6807;&#xFF01;&#x201D;&#x8FFD;&#x51FB;&#x7684;&#x6B66;&#x88C5;&#x5206;&#x5B50;&#x5411;&#x9B03;&#x72D7;&#x6C47;&#x62A5;&#xFF1A;&#x201C;&#x4ED6;&#x4EEC;&#x8DD1;&#x7684;&#x592A;&#x5FEB;&#x4E86;&#xFF0C;&#x6211;&#x4EEC;&#x8FFD;&#x4E0D;&#x4E0A;&#x3002;&#x201D;</p><p>&#x3000;&#x3000;&#x542C;&#x5230;&#x8FD9;&#x8BDD;&#xFF0C;&#x9B03;&#x72D7;&#x8F7B;&#x8F7B;&#x772F;&#x8D77;&#x773C;&#x775B;&#xFF0C;&#x53F3;&#x624B;&#x8F7B;&#x8F7B;&#x629A;&#x6478;&#x8170;&#x95F4;&#x7684;&#x6C99;&#x6F20;&#x4E4B;&#x9E70;&#x624B;&#x67AA;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x8FD9;&#x662F;&#x4E00;&#x4E2A;&#x5BF9;&#x4E1B;&#x6797;&#x5730;&#x5F62;&#x719F;&#x6089;&#x65E0;&#x6BD4;&#x7684;&#x4EBA;&#xFF0C;&#x6211;&#x4EEC;&#x9047;&#x5230;&#x4E86;&#x5BF9;&#x624B;&#x3002;&#x201D;&#x9B03;&#x72D7;&#x4F4E;&#x58F0;&#x9053;&#x3002;</p><p>&#x3000;&#x3000;&#x8FD9;&#x513F;&#x662F;&#x4E1B;&#x6797;&#xFF0C;&#x4ED6;&#x4EEC;&#x624D;&#x662F;&#x6700;&#x719F;&#x6089;&#x8FD9;&#x7247;&#x4E1B;&#x6797;&#x5730;&#x5F62;&#x7684;&#x4EBA;&#xFF0C;&#x4E0D;&#x7BA1;&#x662F;&#x4ED6;&#x9B03;&#x72D7;&#x8FD8;&#x662F;&#x624B;&#x4E0B;&#x7684;&#x6BCF;&#x4E00;&#x540D;&#x6218;&#x58EB;&#x3002;</p><p>&#x3000;&#x3000;&#x53EF;&#x5728;&#x8FD9;&#x79CD;&#x60C5;&#x51B5;&#x4E0B;&#x538B;&#x6839;&#x8FFD;&#x4E0D;&#x4E0A;&#x5BF9;&#x65B9;&#xFF0C;&#x90A3;&#x53EA;&#x80FD;&#x8BC1;&#x660E;&#x4E00;&#x4E2A;&#x95EE;&#x9898;&#xFF0C;&#x4ED6;&#x4EEC;&#x9047;&#x5230;&#x4E86;&#x771F;&#x6B63;&#x7684;&#x5BF9;&#x624B;&#xFF0C;&#x9047;&#x5230;&#x4E86;&#x4E00;&#x5934;&#x751F;&#x6D3B;&#x5728;&#x731B;&#x517D;&#x3002;</p><p>&#x3000;&#x3000;&#x4E8B;&#x5B9E;&#x4E0A;&#x845B;&#x9707;&#x538B;&#x6839;&#x6CA1;&#x6709;&#x592A;&#x591A;&#x7684;&#x4E1B;&#x6797;&#x7ECF;&#x9A8C;&#xFF0C;&#x4ED6;&#x65E0;&#x975E;&#x5C31;&#x662F;&#x5728;&#x751F;&#x547D;&#x53D7;&#x5230;&#x5A01;&#x80C1;&#x7684;&#x60C5;&#x51B5;&#x4E0B;&#xFF0C;&#x7206;&#x53D1;&#x51FA;&#x8EAB;&#x4F53;&#x5185;&#x6240;&#x6709;&#x7684;&#x6F5C;&#x80FD;&#xFF0C;&#x4ECE;&#x800C;&#x9020;&#x6210;&#x9B03;&#x72D7;&#x7684;&#x8BEF;&#x5224;&#x3002;</p><p>&#x3000;&#x3000;&#x800C;&#x9B03;&#x72D7;&#x662F;&#x4EC0;&#x4E48;&#xFF1F;&#x4ED6;&#x53EF;&#x4EE5;&#x8BF4;&#x662F;&#x8FD9;&#x7247;&#x4E1B;&#x6797;&#x7684;&#x738B;&#xFF0C;&#x845B;&#x9707;&#x80FD;&#x591F;&#x8BA9;&#x4ED6;&#x5347;&#x51FA;&#x8BEF;&#x5224;&#xFF0C;&#x53EF;&#x89C1;&#x90A3;&#x7206;&#x53D1;&#x529B;&#x7A76;&#x7ADF;&#x591A;&#x4E48;&#x60CA;&#x4EBA;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x4ED6;&#x4EEC;&#x5728;&#x4E0A;&#x5C71;&#x3002;&#x201D;&#x9B03;&#x72D7;&#x5438;&#x5438;&#x9F3B;&#x5B50;&#x53D1;&#x51FA;&#x9634;&#x51B7;&#x7684;&#x58F0;&#x97F3;&#xFF1A;&#x201C;&#x6211;&#x95FB;&#x5230;&#x5473;&#x4E86;&#x2026;&#x2026;&#x56F4;&#x5C71;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x201C;&#x662F;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x6570;&#x5343;&#x6B66;&#x88C5;&#x5206;&#x5B50;&#x7ACB;&#x523B;&#x671D;&#x4E0D;&#x540C;&#x7684;&#x65B9;&#x5411;&#x8DD1;&#x53BB;&#xFF0C;&#x5BF9;&#x845B;&#x9707;&#x6240;&#x5728;&#x5C71;&#x5934;&#x5B9E;&#x65BD;&#x5305;&#x56F4;&#xFF0C;&#x5F53;&#x4ED6;&#x4EEC;&#x5B8C;&#x6210;&#x5305;&#x56F4;&#x4E4B;&#x540E;&#xFF0C;&#x5C06;&#x610F;&#x5473;&#x7740;&#x4E24;&#x4E2A;&#x4EBA;&#x5F7B;&#x5E95;&#x9677;&#x5165;&#x6B7B;&#x8DEF;&#x3002;</p><p>&#x3000;&#x3000;&#x56F4;&#x800C;&#x6740;&#xFF0C;&#x9B03;&#x72D7;&#x53EF;&#x4EE5;&#x4E22;&#x5931;&#x9635;&#x5730;&#xFF0C;&#x4F46;&#x7EDD;&#x4E0D;&#x80AF;&#x653E;&#x8FC7;&#x845B;&#x9707;&#x4E24;&#x4EBA;&#xFF01;</p><p>&#x3000;&#x3000;&#x2026;&#x2026;</p><p>&#x3000;&#x3000;&#x625B;&#x7740;&#x80E1;&#x6D77;&#x6D6A;&#x72C2;&#x51B2;&#x5230;&#x534A;&#x5C71;&#x8170;&#xFF0C;&#x845B;&#x9707;&#x91CD;&#x91CD;&#x8EBA;&#x5012;&#x5728;&#x5730;&#xFF0C;&#x5589;&#x5499;&#x91CC;&#x53D1;&#x51FA;&#x5947;&#x602A;&#x7684;&#x547C;&#x5438;&#x58F0;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x54E6;&#x2026;&#x2026;&#x54E6;&#x2026;&#x2026;&#x54E6;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x4ED6;&#x7684;&#x77B3;&#x5B54;&#x5728;&#x6536;&#x7F29;&#xFF0C;&#x628A;&#x5634;&#x5F20;&#x5230;&#x6700;&#x5927;&#xFF0C;&#x62FC;&#x547D;&#x7684;&#x547C;&#x5438;&#x7A7A;&#x6C14;&#x3002;</p><p>&#x3000;&#x3000;&#x5F53;&#x4E00;&#x80A1;&#x80A1;&#x7A7A;&#x6C14;&#x901A;&#x8FC7;&#x5634;&#x5DF4;&#x4E0E;&#x9F3B;&#x5B54;&#x8FDB;&#x5165;&#x6C14;&#x7BA1;&#xFF0C;&#x518D;&#x8FDB;&#x5165;&#x80BA;&#x90E8;&#x7684;&#x65F6;&#x5019;&#xFF0C;&#x80F8;&#x524D;&#x4F20;&#x6765;&#x9635;&#x9635;&#x523A;&#x75DB;&#xFF0C;&#x5BFC;&#x81F4;&#x6574;&#x4E2A;&#x8EAB;&#x4F53;&#x5448;&#x73B0;&#x51FA;&#x8282;&#x594F;&#x7684;&#x75C9;&#x631B;&#x3002;</p><p>&#x3000;&#x3000;&#x8FD9;&#x662F;&#x845B;&#x9707;&#x7B2C;&#x4E00;&#x6B21;&#x73A9;&#x547D;&#x7684;&#x8DD1;&#xFF0C;&#x4ED6;&#x89C9;&#x5F97;&#x81EA;&#x5DF1;&#x5FEB;&#x8981;&#x6B7B;&#x4E86;&#xFF0C;&#x624B;&#x811A;&#x5B8C;&#x5168;&#x4E0D;&#x542C;&#x5927;&#x8111;&#x6307;&#x6325;&#xFF0C;&#x80BA;&#x90E8;&#x75BC;&#x7684;&#x50CF;&#x662F;&#x8981;&#x70B8;&#x5F00;&#x3002;</p><p>&#x3000;&#x3000;&#x8DB3;&#x8DB3;&#x8FC7;&#x4E86;&#x4E00;&#x5206;&#x591A;&#x949F;&#xFF0C;&#x4ED6;&#x624D;&#x6162;&#x6162;&#x7684;&#x7F13;&#x8FC7;&#x52B2;&#x3002;</p><p>&#x3000;&#x3000;&#x6B66;&#x88C5;&#x5206;&#x5B50;&#x88AB;&#x7529;&#x5F00;&#xFF0C;&#x5DF2;&#x7ECF;&#x542C;&#x4E0D;&#x5230;&#x67AA;&#x54CD;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x54E5;&#x4EEC;&#xFF0C;&#x633A;&#x4F4F;&#x5440;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x845B;&#x9707;&#x4F38;&#x624B;&#x6309;&#x5728;&#x80E1;&#x6D77;&#x6D6A;&#x7684;&#x8116;&#x9888;&#x4E0A;&#xFF0C;&#x5728;&#x611F;&#x53D7;&#x5230;&#x8FD8;&#x6709;&#x5FC3;&#x8DF3;&#x4E4B;&#x540E;&#xFF0C;&#x9A6C;&#x4E0A;&#x6495;&#x5F00;&#x5BF9;&#x65B9;&#x7684;&#x8863;&#x670D;&#xFF0C;&#x5BF9;&#x5176;&#x8FDB;&#x884C;&#x62A2;&#x6551;&#x3002;</p><p>&#x3000;&#x3000;&#x5F39;&#x5934;&#x94BB;&#x8FDB;&#x7684;&#x662F;&#x53F3;&#x8179;&#xFF0C;&#x4F24;&#x53E3;&#x7206;&#x5F00;&#xFF0C;&#x5F39;&#x5934;&#x85CF;&#x5728;&#x6DF1;&#x5904;&#x3002;</p><p>&#x3000;&#x3000;&#x4ED6;&#x4F38;&#x51FA;&#x4E24;&#x6839;&#x624B;&#x6307;&#x585E;&#x8FDB;&#x4F24;&#x53E3;&#xFF0C;&#x5C1D;&#x8BD5;&#x89E6;&#x78B0;&#x5F39;&#x5934;&#x7684;&#x4F4D;&#x7F6E;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x5431;&#xFF01;&#x2014;&#x2014;&#x201D;</p><p>&#x3000;&#x3000;&#x4F24;&#x53E3;&#x53D7;&#x5230;&#x6324;&#x538B;&#xFF0C;&#x4E00;&#x80A1;&#x8840;&#x6C34;&#x6D8C;&#x51FA;&#xFF0C;&#x80E1;&#x6D77;&#x6D6A;&#x7684;&#x8EAB;&#x4F53;&#x4E5F;&#x968F;&#x4E4B;&#x98A4;&#x4E86;&#x4E00;&#x4E0B;&#xFF0C;&#x90A3;&#x660F;&#x8FF7;&#x7684;&#x8138;&#x988A;&#x5448;&#x73B0;&#x51FA;&#x75DB;&#x82E6;&#x7684;&#x626D;&#x66F2;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x5988;&#x4E2A;&#x86CB;&#x7684;&#xFF0C;&#x5F39;&#x5934;&#x6BD4;&#x60F3;&#x8C61;&#x7684;&#x85CF;&#x7684;&#x66F4;&#x6DF1;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x845B;&#x9707;&#x9A82;&#x4E86;&#x4E00;&#x58F0;&#xFF0C;&#x62FF;&#x51FA;&#x624B;&#x672F;&#x5200;&#xFF0C;&#x54AC;&#x7259;&#x628A;&#x4F24;&#x53E3;&#x5207;&#x5F00;&#x6269;&#x5927;&#xFF0C;&#x8BA9;&#x624B;&#x6307;&#x80FD;&#x591F;&#x66F4;&#x52A0;&#x6DF1;&#x5165;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x5431;&#xFF01;&#x2014;&#x2014;&#x201D;</p><p>&#x3000;&#x3000;&#x53C8;&#x662F;&#x4E00;&#x80A1;&#x9C9C;&#x8840;&#x6324;&#x538B;&#x51FA;&#x6765;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x6478;&#x5230;&#x4E86;&#xFF01;&#x201D;&#x845B;&#x9707;&#x54AC;&#x7259;&#x9053;&#xFF1A;&#x201C;&#x522B;&#x602A;&#x54E5;&#x4EEC;&#x7C97;&#x9C81;&#xFF0C;&#x6211;&#x53EA;&#x80FD;&#x628A;&#x4F60;&#x5F53;&#x6210;&#x6B7B;&#x4EBA;&#x6765;&#x6551;&#x3002;&#x201D;</p><p>&#x3000;&#x3000;&#x5148;&#x53D6;&#x5F39;&#x5934;&#xFF0C;&#x7136;&#x540E;&#x5C3D;&#x4EBA;&#x4E8B;&#x5B89;&#x5929;&#x547D;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x5939;&#x4F4F;&#x4E86;&#x2026;&#x2026;&#x5939;&#x4F4F;&#x4E86;&#x2026;&#x2026;&#x62FF;&#x5230;&#x4E86;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x4E24;&#x6839;&#x624B;&#x6307;&#x4ECE;&#x4EBA;&#x4F53;&#x7684;&#x53F3;&#x8179;&#x5185;&#x62D4;&#x51FA;&#xFF0C;&#x5E26;&#x7740;&#x4E00;&#x80A1;&#x80A1;&#x9C9C;&#x8840;&#xFF0C;&#x628A;&#x5F39;&#x5934;&#x53D6;&#x51FA;&#x6765;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x55EF;&#xFF01;&#x2014;&#x2014;&#x201D;</p><p>&#x3000;&#x3000;&#x6C89;&#x95F7;&#x800C;&#x75DB;&#x82E6;&#x7684;&#x58F0;&#x97F3;&#x53D1;&#x51FA;&#xFF0C;&#x80E1;&#x6D77;&#x6D6A;&#x7684;&#x8EAB;&#x4F53;&#x731B;&#x7136;&#x5750;&#x76F4;&#xFF0C;&#x53CC;&#x773C;&#x6012;&#x7741;&#xFF0C;&#x773C;&#x7403;&#x66B4;&#x51F8;&#x3002;</p><p>&#x3000;&#x3000;&#x75BC;&#xFF0C;&#x592A;&#x75BC;&#x4E86;&#xFF0C;&#x628A;&#x4ED6;&#x4ECE;&#x660F;&#x6B7B;&#x4E2D;&#x751F;&#x751F;&#x75BC;&#x9192;&#x8FC7;&#x6765;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x7ED9;&#x6211;&#x8EBA;&#x4E0B;&#xFF01;&#x201D;</p><p>&#x3000;&#x3000;&#x845B;&#x9707;&#x4E00;&#x5DF4;&#x638C;&#x62BD;&#x5728;&#x5BF9;&#x65B9;&#x80F8;&#x53E3;&#xFF0C;&#x8BA9;&#x5176;&#x8EBA;&#x4E0B;&#x3002;</p><p>&#x3000;&#x3000;&#x201C;&#x77E5;&#x9053;&#x54E5;&#x4EEC;&#x4E3A;&#x5565;&#x80FD;&#x4EE5;&#x536B;&#x751F;&#x5458;&#x7684;&#x8EAB;&#x4EFD;&#x6765;&#x53C2;&#x52A0;&#x7EF4;&#x548C;&#x5417;&#xFF1F;&#x56E0;&#x4E3A;&#x5728;&#x6211;&#x624B;&#x5E95;&#x4E0B;&#x4ECE;&#x6765;&#x5C31;&#x6CA1;&#x6709;&#x6551;&#x4E0D;&#x6D3B;&#x7684;&#x4EBA;&#x3002;&#x201D;</p><p>&#x3000;&#x3000;&#x8C6A;&#x6C14;&#x51B2;&#x4E91;&#x5929;&#xFF0C;&#x81EA;&#x4FE1;&#x6EE1;&#x6C5F;&#x6E56;&#xFF01;</p><p>&#x3000;&#x3000;&#x201C;&#x55EF;&#x2026;&#x2026;&#x201D;&#x80E1;&#x6D77;&#x6D6A;&#x7684;&#x75C9;&#x631B;&#x62BD;&#x6410;&#xFF0C;&#x8D39;&#x529B;&#x65E0;&#x6BD4;&#x7684;&#x8F6C;&#x5934;&#x770B;&#x5411;&#x845B;&#x9707;&#xFF1A;&#x201C;&#x8C22;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x201C;&#x4E0D;&#x7528;&#x8C22;&#x3002;&#x201D;&#x845B;&#x9707;&#x4E00;&#x9F87;&#x7259;&#xFF1A;&#x201C;&#x4F60;&#x662F;&#x6211;&#x7B2C;&#x4E00;&#x4E2A;&#x8981;&#x6551;&#x7684;&#x4EBA;&#x2026;&#x2026;&#x201D;</p><p>&#x3000;&#x3000;&#x80E1;&#x6D77;&#x6D6A;&#x7684;&#x8EAB;&#x5B50;&#x75AF;&#x72C2;&#x98A4;&#x6296;&#xFF0C;&#x773C;&#x775B;&#x81F3;&#x59CB;&#x81F3;&#x7EC8;&#x77AA;&#x7684;&#x6EDA;&#x5706;&#xFF0C;&#x4E0D;&#x77E5;&#x9053;&#x662F;&#x60B2;&#x54C0;&#x8FD8;&#x662F;&#x5D29;&#x6E83;&#x3002;</p><p>&#x3000;&#x3000;&#x2026;&#x2026;</p>\n        \t\t\t\t\t\t  ",
        prevUrl: 'https://www.biquge5200.cc/92_92627/167643690.html',
        nextUrl: 'https://www.biquge5200.cc/92_92627/',

        all: [],        // 所有列表信息
        page: [],       // 大分页 1-100、101-200、201-300
        list: [],       // 小分页展示的数据 
        chapterVisible: false,      // 左侧章节抽屉是否可见

        menuVisible: false,         // 菜单抽屉是否可见。'目录' | '设置' | '白天/黑夜'
        isDark: false,              // 白天还是黑夜

        settingVisible: false,      // 设置抽屉是否可见。字体大小、背景颜色、亮度
        bgColor: 'rgb(244, 243, 249)',
    }

    componentWillMount() {
        const { bookName = '兵者', chapterUrl = 'https://www.biquge5200.cc/98_98081/155305426.html', novelId } = this.$router.params
        const novelUrl = chapterUrl.split('/').slice(0, 4).join('/')   // 用于查询目录

        // this.handleGetChapterList(novelUrl)
        // this.handleGetNovelContent(chapterUrl)
    }

    /**
     * 查询目录
     */
    handleGetChapterList(url) {
        request({
            url: api.GET_CHAPTER,
            data: { url },
        }).then(res => {
            // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
            const integer = Math.floor(res.length / 100)        // 整数部分
            const remainder = res.length % 100                  // 小数部分
            
            const page: Array<Page> = []

            /**
             * start、end  下标从 0 开始
             * page    0-99、100-199、200-299
             */
            for (let i = 0; i <= integer; i++) {
                const obj = Object.create(null)
                obj.id = String(i)
                obj.start = i * 100

                if (integer === 0) {   // 只有一页，0 - 88
                    obj.end = remainder - 1
                } else if (i === integer) {  // 最后一页
                    obj.end = i * 100 + remainder - 1
                } else {
                    obj.end = (i + 1) * 100 - 1
                }
                
                obj.desc = `${obj.start + 1} - ${obj.end + 1}`

                page.push(obj)
            }

            this.setState({
                all: res,
                page,
                list: res.slice(0, 100),
            })
        })
    }

    /**
     * 查询小说内容
     */
    handleGetNovelContent (url) {
        const { prevUrl, nextUrl, novelId } = this.state

        if (prevUrl.indexOf('.html') === -1 && nextUrl.indexOf('.html') !== -1) {
            return Taro.showToast({ title: '已经是第一章了', icon: 'none' }) 
        }
        if (prevUrl.indexOf('.html') !== -1 && nextUrl.indexOf('.html') === -1) {
            return Taro.showToast({ title: '已经是最新章节了', icon: 'none' })
        }

        request({
            url: api.GET_CONTENT,
            data: { url },
        }).then(res => {
            const { title, content, prev_url, next_url } = res
            this.setState({
                title,
                content,
                prevUrl: prev_url,
                nextUrl: next_url,
            })

            // TODO 更新小说阅读章节
            return request({
                url: api.EDIT_SHELF,
                method: 'PUT',
                data: {
                    recent_chapter_url: url, 
                    id: novelId,
                }
            })
        }).then(res => {})
    }

    /**
     * 更改状态
     */
    handleUpdateState (variable: any, value?: any) {
        if (typeof variable === 'string') {
            this.setState({
                [variable]: value
            })
        } else {
            this.setState(variable)
        }
    }

    /**
     * 渲染设置抽屉
     */
    renderMenu () {
        const { isDark, menuVisible } = this.state

        return (
            <AtActionSheet isOpened={menuVisible}>
                <View className='at-row menu'>
                    <View className='at-col' 
                        onClick={() => this.handleUpdateState({ menuVisible: false, chapterVisible: true })}>
                        <View className='at-icon at-icon-bullet-list'></View>
                        <View>目录</View>
                    </View>

                    <View className='at-col'
                        onClick={() => this.handleUpdateState({ menuVisible: false, settingVisible: true })}>
                        <View className='at-icon at-icon-settings'></View>
                        <View>设置</View>
                    </View>
                    
                    {
                        isDark ? (
                            <View className='at-col' 
                                onClick={() => this.handleUpdateState({isDark: !isDark, bgColor: 'rgb(244, 243, 249)'})}>
                                <View className='at-icon at-icon-loading-2'></View>
                                <View>白天</View>
                            </View>
                        ) : (
                            <View className='at-col' 
                                onClick={() => this.handleUpdateState({ isDark: !isDark, bgColor: 'rgb(0, 0, 0)' })}>
                                <View className='at-icon at-icon-star'></View>
                                <View>黑夜</View>
                            </View>
                        )
                    }
                </View>
            </AtActionSheet>
        )
    }

    /**
     * 渲染章节抽屉
     */
    renderChapter () {
                

        return (
            <AtDrawer
                show={this.state.chapterVisible}
                mask
            >
                <View className="chapter">
                    <View className="bookname">
                        {}
                    </View>

                    <View>

                    </View>

                    <View>

                    </View>
                </View>
            </AtDrawer>
        )
    }

    /**
     * 渲染设置
     */
    renderSetting () {
        const { settingVisible } = this.state

        return (
            <AtActionSheet isOpened={settingVisible}>
                设置
            </AtActionSheet>
        )
    }

    render() {
        const { content, title, prevUrl, nextUrl, bgColor } = this.state

        return (
            <View className="container" style={{ backgroundColor: bgColor }}>
                <View className="content">
                    <RichText className="at-article__p" nodes={content}
                        onClick={() => this.handleUpdateState('menuVisible', true)}></RichText>
                </View>

                <View className="at-row footer">
                    <View className='at-col at-col-6'>
                        {title}
                    </View>
                    <View className='at-col at-col-3'
                        onClick={() => this.handleGetNovelContent(prevUrl)}>
                        上一章
                    </View> 
                    <View className='at-col at-col-3'
                        onClick={() => this.handleGetNovelContent(nextUrl)}>
                        下一章
                    </View> 
                </View>

                {this.renderMenu()}
                {this.renderChapter()}
                {this.renderSetting()}
            </View>
        )
    }
}