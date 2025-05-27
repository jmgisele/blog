<script>
	import Highlight from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github';
	import { ini, shell } from 'svelte-highlight/languages';

	import Footnote from '../lib/footnote/Footnote.svelte';
	import SuperScript from '../lib/footnote/SuperScript.svelte';
	import RainbowLink from '../lib/text_styling/RainbowLink.svelte';

	const lsblk = `$ lsblk

NAME                     SIZE RO TYPE  MOUNTPOINTS
zram0                      4G  0 disk  [SWAP]
nvme0n1                500.0G  0 disk  
├─nvme0n1p1              512M  0 part  /boot
└─nvme0n1p2            500.0G  0 part  /home
                                       /.snapshots
                                       /`;

	const resize = `# echo "mount btrfs filesystem"
$ mount /dev/nvme0n1p2 /mnt 

# echo "ensure filesystem is mounted & get the id"
$ btrfs filesystem show
    uuid: 1e5a6667-db6f-44e6-a9f8-2b9e525be25e
	Total devices 1 FS bytes used 100.00GiB
	devid    1 size 500.00GiB used 100.00GiB path /mnt

# echo "resize filesystem"
# echo "shrink devid 1, mounted at /mnt, by 32MiB"
$ btrfs filesystem resize 1:-32M /mnt 

# echo "unmount"
$ umount /mnt
`;

	const encrypt = `# echo "encrypting the filesystem - verbatim from arch wiki"
$ cryptsetup reencrypt --encrypt --reduce-device-size 32M /dev/nvme0n1p2

WARNING!

========

This will overwrite data on LUKS2-temp-12345678-9012-3456-7890-123456789012.new irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
Enter passphrase for LUKS2-temp-12345678-9012-3456-7890-123456789012.new: 
Verify passphrase: 

`;

	const openUp = `# echo "open the encrypted partition"
$ cryptsetup open /dev/nvme0n1p2 root

# echo "mount the root subvolume"
$ mount -o subvol=@ /dev/mapper/root /mnt 

# echo "resize devid 1 mounted at /mnt to take up maximum space"
$ btrfs filesystem resize 1:max /mnt
`;

	const chroot = `# echo "mount the boot partition"
$ mount /dev/nvme0n1p1 /mnt/boot

# echo "chroot in (may differ by distro // you may need to install additional packages)"
$ arch-chroot /mnt
`;

	const bootloader = `# /boot/loader/entries/whatever_entry.conf 
title   Arch Linux (linux)
linux   /vmlinuz-linux
initrd  /amd-ucode.img
initrd  /initramfs-linux.img
options root=PARTUUID=17849ee1-21ed-4b51-a57b-00aaf03d2419  zswap.enabled=0 rootflags=subvol=@ rw rootfstype=btrfs
`;
	const bootloader2 =
		'options rd.luks.name=24c3bbbb-76f7-4e53-85d6-23f6e8562420=root root=/dev/nvme0n1p2 rw zswap.enabled=0 rootflags=subvol=@ rw rootfstype=btrfs';

	const all_good = `$ cryptsetup luksDump /dev/nvme0n1p2
    
LUKS header information
Version:       	2
Epoch:         	60986
...`;
</script>

<svelte:head>
	{@html github}
</svelte:head>

<h1>Encrypting an existing btrfs root partition</h1>
<h2>26 May 2025</h2>
<h3>this is not difficult but I couldn't find a good step-by-step via a brief google!</h3>
<p>
	I've got an existing arch install that I didn't encrypt at installation. I recently decided: that
	was pretty stupid and I should really remedy that! If someone with a small amount of technical
	knowhow got hold of my device, they could easily get a lot of information out of it I'd rather
	they couldn't. I've been busy enough of late I knew I didn't have a full re-install in me this
	past weekend. So, I decided to risk it anyway by trying to encrypt my existing install.<SuperScript
		id="system"
	/> Here's some info if you're trying to do the same!
</p>
<h4>linux system encryption 101</h4>
<h5>
	disclaimer: i am not an expert on encryption on linux please do like Some research before typing
	commands into a shell
</h5>
<h5>note: all UUIDs are randomly generated, they will not correspond across this post!</h5>
<p>
	There are <RainbowLink
		href="https://wiki.archlinux.org/title/Dm-crypt/Encrypting_an_entire_system"
		>many options</RainbowLink
	> depending on what your use case and threat model is. Probably you want <RainbowLink
		href="https://wiki.archlinux.org/title/Dm-crypt/Encrypting_an_entire_system#LUKS_on_a_partition"
		>LUKS on a partition</RainbowLink
	>, as long as you're not using LVM. If you're worried about someone tampering with your physical
	device, you can add secure boot. I am more worried about people taking my device and not returning
	it. You may also want to look into <RainbowLink
		href="https://wiki.archlinux.org/title/Dm-crypt/Swap_encryption"
		>encrypting your swap.</RainbowLink
	>
</p>
<p>
	If you want to encrypt your boot partition as well (say....if you're using the same partition for
	root/home/boot), you should check if you're using systemd or GRUB. GRUB is not compatible with
	LUKS2, so you'll have to make sure you're using LUKS1 to encrypt. If you're just encrypting your
	root partition and not boot you're fine, I believe because the kernel takes over before decryption
	of the root partition occurs.
</p>
<h4>backup your shit, dummy</h4>
<p>
	Please! If something goes wrong, and it <i>can</i> go wrong, your data is bust and you'll be
	reinstalling from scratch. I like borg, <RainbowLink
		href="https://jstaf.github.io/posts/backups-with-borg-rsync/">here's</RainbowLink
	> a good primer on that if you're in the market. Also, <b>this process will take a while</b>, so
	budget an afternoon! For me, with ~200GB of data on my drive, it took ~1.5hrs to run the
	encryption process alone.
</p>
<h4>get a live usb & boot into it</h4>
<p>
	Any system will do. I used Pop!OS because I know it works well on my device and gives me a display
	manager from the getgo unlike arch
</p>
<h4>see what you're working with</h4>
<p>First, you wanna figure out what drives you've got. Mine looked something like this:</p>
<Highlight language={shell} code={lsblk} />
<p>
	A zram swap spartition and one drive divided into two partitions, one for boot and one for my root
	filesystem, which is using btrfs with subvolumes. btrfs is nice because you can have one partition
	for your root & home & snapshot filesystems, without needing to re-size anything if you end up
	needing more/less space on your root vs home partition. I moved to btrfs after having a long-term
	Ubuntu install on ext4 run out of root partition space and realizing the only viable solution was
	reinstalling my system from scratch. There are other solns but this is the one I have stuck with!
</p>
<p>
	If you've got a single btrfs filesystem spanning multiple drives, or if you've got your home
	volume set up on a different drive/partition as your root, you'll have to do some digging to
	customize the following/figure out if you need multiple LUKS setups.
</p>
<p>
	Once you've figured out which partition(s) you want to encrypt, you'll have to resize the
	filesystem living on it slightly. LUKS has a 32MiB header it slots in at the start of the
	partition which basically <RainbowLink href="https://security.stackexchange.com/a/203675"
		>tells the bootloader or kernel</RainbowLink
	>
	"i'm encrypted! please ask for the passphrase & then here is how to use it." We've got to resize our
	filesystem (NOT our partition!) to free up that space for the header.
</p>
<p>
	If you're using ext, i'll direct you to <RainbowLink
		href="https://srijan.ch/encrypting-an-existing-linux-systems-root-partition"
		>this post</RainbowLink
	>. If you're using xfs, it cannot be shrunk, only grown. Hopefully you're here because you're on
	btrfs, for which the process is as below.
</p>
<h4>mount the partition and shrink your filesystem</h4>
<p>
	It's weird that you have to mount a btrfs partition to change the size of its filesystem since you
	generally <i>don't</i> want to mount an ext4 partition for such tasks! here's the process. assuming
	you're booted into a live USB from here on out:
</p>
<Highlight language={shell} code={resize} />
<h4>encrypt the partition</h4>
<p>
	This is the part that will take a while and will be destructive if interrupted. for the love of gd
	back your stuff up, plug your machine in if relevant, and be prepared to sit a while!
</p>
<Highlight language={shell} code={encrypt} />
<p>This took maybe an hour and a half for my machine.</p>

<h4>resize filesystem & configure boot</h4>
<p>Time to resize the btrfs system to take up all available space again.</p>
<Highlight language={shell} code={openUp} />
<p>
	You'll also need to mount your boot partition so you can chroot in and configure boot parameters
	and the like.
</p>
<Highlight language={shell} code={chroot} />
<h4>final config</h4>
<p>
	Edit <span class="hljs">/etc/mkinitcpio.conf</span> to contain the
	<span class="hljs">encrypt</span> hook. If you're using systemd to boot you may also need to add <RainbowLink
		href="https://wiki.archlinux.org/title/Dm-crypt/Encrypting_an_entire_system#Configuring_mkinitcpio"
		>additional</RainbowLink
	>
	hooks.
</p>
<Highlight
	language={ini}
	code={`# /etc/mkinitcpio.conf
# ...
HOOKS=(base udev autodetect keyboard keymap modconf block encrypt filesystems fsck)
`}
/>
<p>And regenerate the initramfs. . .</p>
<Highlight language={shell} code={`$ mkinitcpio -P`} />
<p>Next, check your bootloader. Mine looked like this:</p>
<Highlight language={ini} code={bootloader} />
<p>
	I needed to change it slightly to hook into the correct partition post-encrypt. The UUID here
	should be of the partition, found via the command <span class="hljs">blkid /dev/nvme0n1p2</span>.
</p>
<Highlight language={ini} code={bootloader2} />
<p>
	I didn't need to edit my <span class="hljs">/etc/fstab</span> to point at anything differently,
	since my subvolumes were all still on the same partition, but you might. If you do,
	<span class="hljs">genfstab</span> might be a tool to look at.
	<span class="hljs">blkid /dev/mapper/root</span> should give you the UUID of the filesystem, which
	is the UUID that all of the subvolumes should point to.
</p>
<h4>boot into the new system and check that everything looks right!</h4>
<p>
	You can now exit the chroot environment and reboot. If all goes well on a reboot, you should be
	presented with a prompt for your passphrase and then your system should boot up as regular from
	there. If you're stuck at your login manager, something's wrong with your fstab. If you're getting
	a "waiting for encrypted source device x," something's wrong with your bootloader.
</p>
<p>As a final check, make sure the LUKS header looks good:</p>
<Highlight language={shell} code={all_good} />
<p>Gorgeous!</p>
<h2>~</h2>
<div>
	<Footnote id="system">
		I've got a pretty nice system setup and backed up with GNU Stow, but there are pesky little
		things I haven't found a good way to back up yet and it always takes longer than you'd like to
		get that all working as it should. <RainbowLink
			href="https://systemcrafters.net/managing-your-dotfiles/using-gnu-stow/"
			>Here's a pretty good intro</RainbowLink
		> to dotfile management with stow if that sounds interesting though!
	</Footnote>
</div>
